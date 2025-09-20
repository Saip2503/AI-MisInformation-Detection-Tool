# Fake News Detector API

A FastAPI-based service for verifying news and social media text using NewsAPI, Twitter, and semantic similarity.

---

## Project Structure

fake-news-detector/
├─ app/
│ ├─ main.py # FastAPI app with /verify endpoint
│ ├─ database.py # SQLAlchemy engine, session, Base
│ ├─ models.py # ORM models (Check table)
│ ├─ classifier.py # SBERT embeddings & similarity functions
│ ├─ schemas.py # Pydantic request/response models
│ └─ requirements.txt # Python dependencies
├─ Dockerfile # Container build instructions
├─ docker-compose.yml # App + Postgres orchestration
├─ init_db.sql # SQL to create initial tables in Postgres
├─ .env.example # Example environment variables
├─ .gitignore # Ignore .env, pycache, Docker volumes, etc.
└─ README.md # Project overview, setup instructions

yaml
Copy code

---

## Setup Instructions

### 1. Clone repo
```bash
git clone <repo-url>
cd fake-news-detector
2. Copy .env.example to .env
bash
Copy code
cp .env.example .env
# Fill in NEWSAPI_KEY and TWITTER_BEARER, adjust DB creds if needed
3. Run with Docker Compose
bash
Copy code
docker-compose up --build
App will be accessible at http://localhost:8080/docs

Postgres will be running with DB initialized from init_db.sql

API Usage
POST /verify
Request Body:

json
Copy code
{
  "text": "Your news or tweet text here"
}
Response:

json
Copy code
{
  "verdict": "Likely True",
  "score": 0.72,
  "evidence": [
    {
      "type": "article",
      "source": "BBC News",
      "title": "COVID-19 vaccine proven effective",
      "url": "https://bbc.com/news/...",
      "sim": 0.81
    },
    {
      "type": "tweet",
      "text": "Just saw the BBC confirming vaccine effectiveness!",
      "sim": 0.65
    }
  ]
}
Notes
Make sure to set NEWSAPI_KEY and TWITTER_BEARER in .env.

Evidence returned is sorted by similarity (top 10).

DB stores every query in checks table.

Dependencies
See app/requirements.txt for all Python dependencies.

FastAPI + Uvicorn

SQLAlchemy + psycopg2

Tweepy

sentence-transformers (SBERT embeddings)

Requests, python-dotenv, numpy, pydantic

Optional
For development, ./app is mounted inside Docker for live reload.

Use docker-compose down -v to remove volumes if needed.

yaml
Copy code

---

This completes a **fully integrated project** with:

- Docker + Docker Compose  
- Postgres initialization  
- FastAPI app  
- Classifier + DB + schemas  
- README + environment config  

---

If you want, I can now provide a **single diagram showing the architecture**: FastAPI → NewsAPI/Twitter → SBERT → Postgres → API response. It will help in your documentation or hackathon submission.  

Do you want me to create that diagram?





Ask ChatGPT





ChatGPT ca