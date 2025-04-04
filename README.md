# Movie Recommendation System using React and FastAPI

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Tech Stack

The project back-end is created using FastAPI in Python, and React is used for the front-end. Tailwind CSS classes are used to style the UI components. It uses "Zustand" for data management and caching. For the database, "Postgres" has been used. It uses TypeScript for type safety and to ensure robust and maintainable code. It helps in catching errors during development and provides better tooling support for the project. 

## Introduction

This is a movie recommendation system where users can browse movies, view details, and get personalized recommendations based on their preferences. Users can also search for movies, rate them, and see trending movies. The system uses collaborative filtering and content-based filtering techniques to generate recommendations.

It supports multi-user authentication and allows users to maintain their watchlist.

The application also includes a feature to display movie trailers using YouTube integration.

## Updates

- Any updates in the project would be added in future

## Screenshots

The style might be subject to change in the future for this project. But, as of now, this is how a few pages look:

Movie details page with trailer and recommendations.

![alt text](./screenshots/movie_details.PNG)

Home page displaying trending movies and search functionality.

![alt text](./screenshots/home_page.PNG)

A working demo of the application in the form of a video can be found here: https://www.youtube.com/watch?v=oJZs_70UR2E

## Deployment using Docker containers

```sh
$ docker-compose up -d --build
$ docker-compose exec web alembic upgrade head
```

## Alembic

```
alembic revision --autogenerate -m "Initial tables"
```

```
alembic upgrade head
```

```
pip install 'pydantic[email]'
```
