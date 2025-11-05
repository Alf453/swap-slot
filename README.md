# SlotSwapper

**SlotSwapper** is a full-stack web application that allows users to manage and swap event or interview slots in real time. It provides secure user authentication, event scheduling, and instant swap notifications using **Socket.IO**. The **frontend** is built with **React (Vite)** and deployed on **Vercel**, while the **backend** is developed using **Node.js, Express, MongoDB, and Socket.IO**, and hosted on **Render**. JWT authentication ensures secure communication between client and server, and CORS is configured to allow both local and production origins for smooth integration.

* **Frontend (Vercel):** [https://swap-slot.vercel.app](https://swap-slot.vercel.app)
* **Backend (Render API):** [https://swap-slot.onrender.com](https://swap-slot.onrender.com)

To run the project locally, clone the repository and install dependencies in both the `frontend` and `backend` folders using `npm install`. In the backend, create a `.env` file with `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` (set to `http://localhost:5173` for local testing), then start it with `npm start` or `npm run dev`. In the frontend, create a `.env` file containing `VITE_API_BASE_URL=http://localhost:5000` and `VITE_SOCKET_URL=http://localhost:5000`, and run `npm run dev` to start the app at `http://localhost:5173`. The backend runs on port 5000 locally and on the Render URL in production.

The main API endpoints are as follows:

* `POST /api/auth/signup` – register a new user
* `POST /api/auth/login` – login and receive a JWT token
* `GET /api/events` / `POST /api/events` – fetch or create events
* `POST /api/swaps` – request a slot swap
* `POST /api/swaps/:id/accept` or `/decline` – manage swap requests

Each protected route requires a `Bearer <token>` header for authentication. The frontend connects to the backend via **Socket.IO**, sending the JWT in the query string for real-time updates when slots are requested, accepted, or declined.

Key challenges included resolving **CORS configuration issues** between the **Vercel frontend** and **Render backend**, and implementing **JWT-based Socket.IO authentication**. These were resolved by explicitly allowing both `http://localhost:5173` and `https://swap-slot.vercel.app` in the backend CORS configuration. The project focuses on modular structure, secure real-time functionality, and a clean, scalable design for seamless communication between client and server.
