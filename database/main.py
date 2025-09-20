import os
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
import requests
import tweepy
from app.classifier import compute_similarities
from app.database import SessionLocal, engine
from app.models import Check, Base
from app.schemas import QueryIn, VerifyOut, EvidenceItem

# Load environment variables
load_dotenv()

# --- FastAPI instance ---
app = FastAPI(title="Fake News Verifier")

# --- DB setup ---
@app.on_event("startup")
def startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"DB init warning: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Config ---
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
TWITTER_BEARER = os.getenv("TWITTER_BEARER")
MAX_NEWS = int(os.getenv("MAX_NEWS_RESULTS", 5))
MAX_TWEETS = int(os.getenv("MAX_TWEETS_RESULTS", 50))
SIM_ART = float(os.getenv("SIM_THRESHOLD_ARTICLE", 0.65))
SIM_TWEET = float(os.getenv("SIM_THRESHOLD_TWEET", 0.55))

# --- Twitter client ---
tw_client = None
if TWITTER_BEARER:
    try:
        tw_client = tweepy.Client(bearer_token=TWITTER_BEARER, wait_on_rate_limit=True)
    except Exception as e:
        print(f"Twitter client init failed: {e}")
        tw_client = None

# --- Endpoint ---
@app.post("/verify", response_model=VerifyOut)
def verify(q: QueryIn, db=Depends(get_db)):
    text = q.text.strip()
    if not text:
        raise HTTPException(400, detail="Empty text provided")

    evidence: List[dict] = []

    # --- 1) NewsAPI search ---
    news_hits = []
    if NEWSAPI_KEY:
        try:
            params = {
                "q": text,
                "pageSize": MAX_NEWS,
                "language": "en",
                "sortBy": "relevancy",
                "apiKey": NEWSAPI_KEY
            }
            r = requests.get("https://newsapi.org/v2/everything", params=params, timeout=10)
            if r.ok:
                data = r.json()
                news_hits = data.get("articles", [])[:MAX_NEWS]
        except Exception as e:
            print(f"NewsAPI fetch error: {e}")

    article_texts = [(a.get("title") or "") + " " + (a.get("description") or "") for a in news_hits]

    # --- 2) Twitter search ---
    tweets: List[str] = []
    if tw_client:
        try:
            query = f'{text} -is:retweet lang:en'
            resp = tw_client.search_recent_tweets(query=query, max_results=min(100, MAX_TWEETS))
            if resp and resp.data:
                tweets = [t.text for t in resp.data][:MAX_TWEETS]
        except Exception as e:
            print(f"Twitter fetch error: {e}")

    # --- 3) Compute similarities ---
    try:
        if article_texts:
            art_sims = compute_similarities(text, article_texts)
            for a, sim in zip(news_hits, art_sims):
                evidence.append({
                    "type": "article",
                    "source": (a.get("source") or {}).get("name"),
                    "title": a.get("title"),
                    "url": a.get("url"),
                    "sim": float(sim)
                })

        if tweets:
            tweet_sims = compute_similarities(text, tweets)
            for t, sim in zip(tweets, tweet_sims):
                evidence.append({
                    "type": "tweet",
                    "text": t,
                    "sim": float(sim)
                })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding error: {e}")

    # --- 4) Improved similarity aggregation ---
    article_sims = [e["sim"] for e in evidence if e["type"] == "article"]
    tweet_sims_list = [e["sim"] for e in evidence if e["type"] == "tweet"]

    max_article_sim = max(article_sims) if article_sims else 0.0
    max_tweet_sim = max(tweet_sims_list) if tweet_sims_list else 0.0

    score = max(max_article_sim, max_tweet_sim)

    if score >= 0.75:               # high confidence
        verdict = "Likely True"
    elif score < 0.35 and evidence:  # low similarity
        verdict = "Likely False"
    else:
        verdict = "Unsure"

    # --- 5) Save to DB ---
    try:
        rec = Check(
            query_text=text,
            verdict=verdict,
            score=float(score),
            evidence=evidence
        )
        db.add(rec)
        db.commit()
    except SQLAlchemyError:
        db.rollback()

    # --- 6) Prepare response ---
    evidence_sorted = sorted(evidence, key=lambda x: x.get("sim", 0), reverse=True)[:10]
    out_evidence: List[EvidenceItem] = [EvidenceItem(**e) for e in evidence_sorted]

    return VerifyOut(verdict=verdict, score=float(score), evidence=out_evidence)
