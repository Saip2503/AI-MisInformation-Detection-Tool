# app/classifier.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarities(texts, reference_texts):
    """
    Compute cosine similarity between each text in `texts` and each text in `reference_texts`.

    Args:
        texts (list[str]): List of input texts (e.g., news articles or tweets).
        reference_texts (list[str]): List of reference texts (e.g., known news corpus).

    Returns:
        list[list[float]]: Cosine similarity matrix [len(texts) x len(reference_texts)].
    """
    # Combine all texts for TF-IDF vectorization
    all_texts = texts + reference_texts
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Split TF-IDF matrix into input and reference
    input_vecs = tfidf_matrix[:len(texts)]
    reference_vecs = tfidf_matrix[len(texts):]

    # Compute cosine similarity
    sim_matrix = cosine_similarity(input_vecs, reference_vecs)
    return sim_matrix

def is_similar(text, reference_texts, threshold=0.65):
    """
    Check if a text is similar to any reference text above a given threshold.

    Args:
        text (str): Input text.
        reference_texts (list[str]): List of reference texts.
        threshold (float): Similarity threshold.

    Returns:
        bool: True if similar to any reference text, False otherwise.
    """
    sim_matrix = compute_similarities([text], reference_texts)
    return any(sim_matrix[0] >= threshold)
