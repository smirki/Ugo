Ugo - College Rideshare App
===========================

Introduction
------------

Welcome to Ugo, the ultimate college rideshare solution! Ugo offers a dynamic platform designed for college students to share rides, host events, and purchase tickets. Our innovative mapping service ensures you get to your destination efficiently.

Features
--------

-   Driving: Share a ride or find a ride to campus, events, and more.
-   Event Hosting: Create and manage events within the college community.
-   Ticketing Service: Easy buying and selling of tickets for campus events.
-   Mapping Service: Navigate campus and beyond with Ugo's bespoke maps.

Development
-----------

Ugo's development workflow is centered around the `dev` branch, which serves as the staging area for all new features and bug fixes.

### Getting Started

-   Clone the repository and create a new branch off `dev` for each feature or bug fix.
-   Use GitHub issues to track tasks. Create a branch for each issue you're working on directly from the issue page.

### Branching and Pull Requests

-   Always branch off `dev`.
-   After completing your work, submit a pull request to `dev`.
-   Pull requests to `main` are reserved for releases and require team review.

### Environment Setup

-   Ask a project maintainer for the `.env` file to connect to MongoDB.
-   Ensure Docker is installed and running for API services.

Technology Stack
----------------

-   Frontend: Developed with React Native for a seamless mobile experience.
-   Backend: Flask API manages database interactions and core functionality.
-   Real-Time Services: `node_websockets` handles real-time driver ride requests.
-   Containerization: Custom APIs are containerized with Docker for consistency across environments.

Running Locally
---------------

1.  Ensure you have Node.js, Python, and Docker installed.
2.  Install dependencies for each part of the project:
    -   `cd frontend/CollegeRideshareApp && npm install`
    -   `cd backend/flask_api && pip install -r requirements.txt`
    -   `cd backend/node_websockets && npm install`
3.  Start the development servers:
    -   Frontend: `npx expo start`
    -   Flask API: `python main.py`
    -   Node WebSockets: `node index.js`
4.  Run Docker containers for the custom APIs:
    -   `docker-compose up --build`

Contributing
------------

We welcome contributions from fellow students and enthusiasts. Please read our contribution guidelines on submitting pull requests to us.

Thank you for being a part of Ugo, where every journey counts!