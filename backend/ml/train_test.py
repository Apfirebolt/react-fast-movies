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

def find_similar_movies():

    # stats of df like data type of each column and null values
    # df['combined_features'] = df['overview'].fillna('') + ' ' + df['genres'].fillna('') + ' ' + df['keywords'].fillna('')
    # print(df.describe())
    # print(df.info())
    # print(df.isnull().sum())

    column_name = 'overview'

    # replace tagline null values with 'no tagline'
    df['tagline'].fillna('no tagline', inplace=True)
    df[column_name].fillna('no overview', inplace=True)

     # Calculate the count of null (missing) values
    null_count = df[column_name].isnull().sum()

    # Calculate the count of not-null (present) values
    not_null_count = df[column_name].notnull().sum()

    print(f"Count of null values in '{column_name}': {null_count}")
    print(f"Count of not-null values in '{column_name}': {not_null_count}")

    null_count_tagline = df['tagline'].isnull().sum()
    not_null_count_tagline = df['tagline'].notnull().sum()

    print(f"Count of null values in 'tagline': {null_count_tagline}")
    print(f"Count of not-null values in 'tagline': {not_null_count_tagline}")

    # count how many times tagline had value of 'no tagline'
    no_tagline_count = df[df['tagline'] == 'no tagline'].shape[0]
    print(f"Count of 'no tagline' in 'tagline': {no_tagline_count}")

    print(df.info())
    print(df.isnull().sum())

find_similar_movies()