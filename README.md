# Music Recommender System

A personalized music recommendation engine that suggests songs based on user preferences using content-based filtering, collaborative filtering, and hybrid recommendation techniques.

![Music Recommender Screenshot](https://example.com/screenshot.png)

## Features

- 🎵 Browse and discover new songs
- ⭐ Rate songs on a scale of 1-5
- ❤️ Save favorite songs
- 🧠 Get personalized recommendations based on:
  - Your genre and artist preferences (content-based)
  - Similar users' ratings (collaborative)
  - A combination of both approaches (hybrid)
- 👤 User authentication and profiles

## Technology Stack

- **Frontend**: React 18.2, React Router 6.8, Axios 1.3
- **Backend**: Node.js, Express 4.18
- **Database**: Mock data stored in JSON files
- **Authentication**: bcryptjs for password hashing
- **Development**: Concurrently, Nodemon for hot-reloading

## Prerequisites

- Node.js (v14 or later)
- npm package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/music-recommender.git
   cd music-recommender
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

## Running the Application

You can run both frontend and backend simultaneously with one command:
