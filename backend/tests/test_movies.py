import pytest

@pytest.fixture
def sample_movie_data():
    return {
        "Search": [
            {
                "Title": "Iron Man",
                "Year": "2008",
                "imdbID": "tt0371746",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
            },
            {
                "Title": "The Avengers",
                "Year": "2012",
                "imdbID": "tt0848228",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMTk3NjQ2NjY5OV5BMl5BanBnXkFtZTcwODc0NTIzMw@@._V1_SX300.jpg"
            }
        ]
    }

def test_movie_titles(sample_movie_data):
    titles = [movie["Title"] for movie in sample_movie_data["Search"]]
    assert "Iron Man" in titles
    assert "The Avengers" in titles

def test_movie_years(sample_movie_data):
    years = [movie["Year"] for movie in sample_movie_data["Search"]]
    assert "2008" in years
    assert "2012" in years

def test_movie_types(sample_movie_data):
    types = {movie["Type"] for movie in sample_movie_data["Search"]}
    assert "movie" in types
    assert len(types) == 1  # Ensure all are of type "movie"