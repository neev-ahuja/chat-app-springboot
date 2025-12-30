
# Chat App with Websockets

A real-time chat application built with **Spring Boot** (Backend) and **React** (Frontend), featuring WebSocket-based messaging, JWT authentication, and MongoDB storage.

## 🚀 Tech Stack

### Backend (`/chatapp`)
- **Framework:** Spring Boot 4.0.1
- **Language:** Java 25
- **Database:** MongoDB
- **Real-time Communication:** WebSocket (STOMP protocol)
- **Security:** Spring Security + JWT (JSON Web Tokens)
- **Build Tool:** Maven

### Frontend (`/frontend`)
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **WebSocket Client:** SockJS + StompJS
- **Toast Notifications:** React Hot Toast

## ✨ Features
- **Real-time Messaging:** Instant message delivery using WebSockets.
- **User Authentication:** Secure login and registration with JWT.
- **Responsive Design:** Modern UI built with Tailwind CSS.
- **Toast Notifications:** Real-time feedback for user actions.

## 🛠️ Prerequisites
Before running the application, ensure you have the following installed:
- **Java JDK 25** (or compatible version)
- **Node.js** & **npm**
- **MongoDB** (Running locally on port 27017 or updated in properties)
- **Maven** (Optional, if using included wrapper)

## 📦 Installation & Setup

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```sh
   cd chatapp
   ```
2. Configure MongoDB:
   - Ensure your MongoDB instance is running.
   - The app connects to `mongodb://localhost:27017/chatappdb` by default.
   - Modify `src/main/resources/application.properties` if needed.
3. Install dependencies and run the application:
   ```sh
   mvn spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port shown in terminal).

## 🔗 Configuration
- **Backend Port:** `8080` (Default)
- **Frontend Port:** `5173` (Default Vite port)
- **Database:** MongoDB (`chatappdb`)
