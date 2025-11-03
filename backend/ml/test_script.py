import pandas as pd
import joblib
import os
from sklearn.metrics.pairwise import cosine_similarity # Imported for completeness, though not strictly needed if only loading artifacts

# Define file paths. These must match the paths used in the model creation script.
MODEL_DIR = 'recommender_model'
SIMILARITY_MATRIX_PATH = os.path.join(MODEL_DIR, 'cosine_similarity_matrix.pkl')
MOVIE_TITLE_MAPPING_PATH = os.path.join(MODEL_DIR, 'movie_title_mapping.pkl')
MOVIE_DATA_PATH = 'backend/ml/movies.csv' # Path to original data, needed to look up movie titles and names

def load_model_components():
    """
    Loads the saved similarity matrix and movie index mapping.
    """
    try:
        # Load the original DataFrame (needed to get movie titles and content)
        df = pd.read_csv(MOVIE_DATA_PATH)
        
        df['tagline'].fillna('no tagline', inplace=True)
        df['overview'].fillna('no overview', inplace=True)
        df['genres'].fillna('', inplace=True)
        df['keywords'].fillna('', inplace=True)
        
        # Load the saved components
        cosine_sim = joblib.load(SIMILARITY_MATRIX_PATH)
        indices = joblib.load(MOVIE_TITLE_MAPPING_PATH)
        
        print("Model components loaded successfully.")
        return df, indices, cosine_sim
    except FileNotFoundError as e:
        print(f"Error loading model components: {e}")
        print("Please ensure you have run the 'movie_recommender.py' script first to create the model files and the CSV file exists.")
        return None, None, None
    except Exception as e:
        print(f"An unexpected error occurred during loading: {e}")
        return None, None, None


def get_recommendations(movie_title, df, indices, cosine_sim, top_n=10):
    """
    Recommends similar movies based on the calculated cosine similarity.
    (This function is copied here so the script is self-contained for testing)
    """
    if movie_title not in indices:
        print(f"\nError: Movie title '{movie_title}' not found in the dataset.")
        return []

    # Get the index of the movie that matches the title
    idx = indices[movie_title]

    # Get the similarity scores for all movies relative to this movie
    # Note: cosine_sim is a numpy array loaded from the pickle file
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity score
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the top 'top_n + 1' most similar movies (excluding the movie itself)
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


# --- Main Execution Block for Testing ---
if __name__ == "__main__":
    
    df, indices, cosine_sim = load_model_components()

    if df is not None:
        
        # Define a list of movies to test the recommender with
        test_movies = [
            'The Dark Knight Rises', 
            'Avatar', 
            'The Avengers',
            'Spectre'
        ]

        for movie in test_movies:
            get_recommendations(movie, df, indices, cosine_sim, top_n=5)