import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

# Define file paths for the model components
MODEL_DIR = 'recommender_model'
SIMILARITY_MATRIX_PATH = os.path.join(MODEL_DIR, 'cosine_similarity_matrix.pkl')
MOVIE_TITLE_MAPPING_PATH = os.path.join(MODEL_DIR, 'movie_title_mapping.pkl')

def create_and_save_model(df):
    """
    Processes movie data, creates the Content-Based Similarity Matrix,
    and saves the necessary components using joblib.
    """
    print("--- Starting Model Creation ---")

    # 1. Feature Engineering and Imputation (as correctly done in your original script)
    # Filling nulls in textual features to prevent errors in TfidfVectorizer
    df['tagline'].fillna('no tagline', inplace=True)
    df['overview'].fillna('no overview', inplace=True)
    df['genres'].fillna('', inplace=True)
    df['keywords'].fillna('', inplace=True)

    # Combine descriptive textual features into a single string
    # We include original_title, genres, keywords, overview, and tagline.
    df['combined_features'] = (
        df['original_title'].astype(str) + ' ' + 
        df['genres'].astype(str) + ' ' +
        df['keywords'].astype(str) + ' ' + 
        df['overview'].astype(str) + ' ' +
        df['tagline'].astype(str)
    )

    print(f"Total number of movies processed: {len(df)}")
    print("\n2. Vectorizing combined features using TF-IDF...")

    # 3. Text Vectorization
    # Initialize TfidfVectorizer. We use a stop_words filter to remove common English words.
    tfidf = TfidfVectorizer(stop_words='english', analyzer='word')
    
    # Fit and transform the data to create the feature matrix
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])
    
    print(f"TF-IDF Matrix Shape: {tfidf_matrix.shape}")

    # 4. Calculate Cosine Similarity
    # This matrix contains the similarity score between every pair of movies.
    print("3. Calculating Cosine Similarity Matrix (This may take a moment)...")
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    print(f"Cosine Similarity Matrix Shape: {cosine_sim.shape}")

    # 5. Create a reverse mapping for movie titles (Title -> Index)
    # This is essential for looking up a movie in the similarity matrix.
    indices = pd.Series(df.index, index=df['title']).drop_duplicates()
    
    # 6. Save the model components
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(cosine_sim, SIMILARITY_MATRIX_PATH)
    joblib.dump(indices, MOVIE_TITLE_MAPPING_PATH)

    print("\n--- Model Components Saved Successfully ---")
    print(f"Similarity Matrix saved to: {SIMILARITY_MATRIX_PATH}")
    print(f"Title Mapping saved to: {MOVIE_TITLE_MAPPING_PATH}")
    return df, indices, cosine_sim


def get_recommendations(movie_title, df, indices, cosine_sim, top_n=10):
    """
    Recommends similar movies based on the calculated cosine similarity.
    """
    if movie_title not in indices:
        print(f"Error: Movie title '{movie_title}' not found in the dataset.")
        return []

    # Get the index of the movie that matches the title
    idx = indices[movie_title]

    # Get the similarity scores for all movies relative to this movie
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity score
    # We sort by the score (element 1 in the tuple) in descending order
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the top 'top_n + 1' most similar movies (we exclude the first one, which is the movie itself)
    sim_scores = sim_scores[1:top_n + 1]

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # Get the similarity scores for printing
    similarity_scores = [i[1] for i in sim_scores]

    # Return the top N most similar movie titles along with their scores
    recommendations = list(zip(df['title'].iloc[movie_indices], similarity_scores))

    print(f"\n--- Top {top_n} Recommendations for '{movie_title}' ---")
    for rank, (title, score) in enumerate(recommendations):
        print(f"{rank+1}. {title} (Score: {score:.4f})")
    
    return recommendations


# --- Main Execution Block ---

# NOTE: Replace 'backend/ml/movies.csv' with the actual path if running outside this environment
try:
    df = pd.read_csv('backend/ml/movies.csv')
    
    # 1. Create and Save the Model
    df_processed, indices, cosine_sim = create_and_save_model(df)

    # 2. Test the Recommendation System
    test_movie = 'The Dark Knight Rises' # A well-known title in movie datasets

    # We call the function using the components created above
    get_recommendations(test_movie, df_processed, indices, cosine_sim)
    
    # Example 2
    test_movie_2 = 'Avatar'
    get_recommendations(test_movie_2, df_processed, indices, cosine_sim)

except FileNotFoundError:
    print("Error: The file 'backend/ml/movies.csv' was not found.")
    print("Please ensure the CSV file is in the correct location or update the path.")

except Exception as e:
    print(f"An unexpected error occurred: {e}")