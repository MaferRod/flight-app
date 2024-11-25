# Flight App
## Table of contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Features](#features)
- [Setup Instructions](#setup-instructions)

## Introduction
The **Search Flight Application** is a full-stack project developed to search flights using Amadeus API.

---
## Technologies
- **Frontend:**
  - React (TypeScript)
  - Axios (for API calls)
  - CSS for basic styling
  
- **Backend:**
  - Spring Boot (Java)
  - Gradle (for dependency management)
  - Amadeus API
---

## Features
- Search flights by origin, destination, departure and arrival date.
- Sort the  results by price, duration or both.
- See the details of the flights by click in them.
  
---
## Setup Instructions

### 1. Prerequisites
Make sure you have the following installed:
- **Java** (JDK 11 or higher): [Download and install Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Gradle (8.8)**: [Download and install Gradle](https://www.apache.org)

### 2. Clone the Repository
```bash
git clone [https://github.com/MaferRod/flight-app.git)
cd todo-app
```
### 3. Backend Setup (Spring Boot)
Navigate to the backend directory:
```bash
cd backend
```
- Build the proyect
  ```bash
   ./gradlew build
  ```
- Run the Spring Boot backend:
  ```bash
   ./gradlew bootRun 
  ```
  The backend will start at http://localhost:8080.

### 4. Frontend Setup (React)
Navigate to the frontend directoty
```bash
cd frontend
```
- Install dependencies
  ```bash
   npm run start
  ```
  The frontend will run at http://localhost:3000.
  
### 4. Docker Setup (Docker Compose)
Make sure to [Download and install Docker](https://www.docker.com)
- Build and Run both services (backend and frontend):
 ```bash
   docker-compose up --build
  ```
- In case you already build the services:
  ```bash
   docker-compose up
  ```
- To turn down the services:
  ```bash
   docker-compose down
  ```
### To acces the application go to:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
  

