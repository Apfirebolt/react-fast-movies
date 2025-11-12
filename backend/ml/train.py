import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Read the CSV file
df = pd.read_csv('backend/ml/movies.csv')

def find_similar_movies(movie_title, df, n=5):

    df['combined_features'] = df['overview'].fillna('') + ' ' + df['genres'].fillna('') + ' ' + df['keywords'].fillna('')

    # Create TF-IDF vectorizer
    tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])

    # Find the movie index
    try:
        movie_idx = df[df['title'].str.contains(movie_title, case=False, na=False)].index[0]
    except IndexError:
        return f"Movie '{movie_title}' not found in the dataset"

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[movie_idx:movie_idx+1], tfidf_matrix).flatten()

    # Get indices of most similar movies (excluding the movie itself)
    similar_indices = cosine_sim.argsort()[-n-1:-1][::-1]

    # Return similar movie titles
    similar_movies = df.iloc[similar_indices]['title'].tolist()
    return similar_movies


def train_and_save_model(df):
    # Preprocess categorical features
    categorical_features = ['title']
    encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    encoded_cats = encoder.fit_transform(df[categorical_features].fillna('Unknown'))

    # Combine encoded categorical features with numerical features
    X = pd.concat([pd.DataFrame(encoded_cats), df[['keywords']].fillna(0)], axis=1)
    X.columns = X.columns.astype(str)
    y = df['keywords'].fillna(0)

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Model Evaluation:\nMSE: {mse}\nR2 Score: {r2}")

    # Save the model and encoder
    joblib.dump(model, 'backend/ml/movie_revenue_model.pkl')
    joblib.dump(encoder, 'backend/ml/encoder.pkl')


# movie_name = input("Enter a movie name to find similar movies: ")
# similar_movies = find_similar_movies(movie_name, df)
# print(f"Movies similar to '{movie_name}':", similar_movies)

train_and_save_model(df)
