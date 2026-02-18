 --- Internhub ---

InternHub is a full-stack MERN application that allows users to register, log in securely, and browse internship opportunities. It demonstrates authentication, protected routes, REST APIs, and MongoDB Atlas integration.

->Features

- User Registration & Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected API Routes
- View Internship Listings
- Logout Functionality
- MongoDB Atlas Cloud Database

-> Tech Stack

 Frontend {
- React.js
- Axios
- React Router DOM
- CSS
}
 Backend {
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- CORS 
}

-> Authentication Flow

- User registers with email and password
- Password is hashed using bcrypt
- On login, JWT token is generated
- Token is stored in localStorage
- Protected routes verify token using middleware

-> API Endpoints

Auth
POST /api/auth/register
POST /api/auth/login

Internships
GET /api/internships
POST /api/internships (Protected)

-> Installation
Backend
cd backend
npm install

 -> Run:

node server.js

Frontend
cd frontend
npm install
npm run dev

-> Tools Used

- Visual Studio Code
- Postman
- MongoDB Atlas
- Cursor AI (used for debugging and development assistance)