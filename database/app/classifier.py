from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarities(query: str, texts: List[str]) -> List[float]:
    """
    Compute cosine similarity between a query string and a list of texts.
    Returns a list of similarity scores (0.0 - 1.0).
    """
    if not texts:
        return []

    vectorizer = TfidfVectorizer().fit([query] + texts)
    vectors = vectorizer.transform([query] + texts).toarray()
    sims = cosine_similarity([vectors[0]], vectors[1:])[0]
    return sims.tolist()
