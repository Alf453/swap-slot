
# SlotSwapper

**SlotSwapper** is a full-stack web application that allows users to manage and swap event or interview slots in real time. It provides secure user authentication, event scheduling, and instant swap notifications using Socket.IO. The frontend is built with **React (Vite)** and deployed on **Vercel**, while the backend uses **Node.js, Express, MongoDB, and Socket.IO**, deployed on **Render**. JWT authentication ensures secure communication between client and server, and CORS is configured to allow both local and production domains.

To run the project locally, clone the repository and install dependencies for both the `frontend` and `backend` folders using `npm install`. Create a `.env` file in the backend with your `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` (set to `http://localhost:5173` for local development). Then start the backend with `npm start` or `npm run dev`. In the frontend, create a `.env` with `VITE_API_BASE_URL=http://localhost:5000` and run `npm run dev` to launch it on `http://localhost:5173`. The backend should be accessible at `http://localhost:5000` locally and `https://swap-slot.onrender.com` in production.

The main API endpoints are:

* `POST /api/auth/signup` – create a user account
* `POST /api/auth/login` – login and get a JWT token
* `GET /api/events` and `POST /api/events` – retrieve or create events
* `POST /api/swaps` – request a swap between two events
* `POST /api/swaps/:id/accept` or `/decline` – manage swap requests

Each authenticated route requires a `Bearer <token>` header. The frontend connects to Socket.IO using the same JWT token for real-time updates when swaps are created or accepted.

During development, the main challenges included handling **CORS between Vercel and Render**, and **JWT validation through Socket.IO**. These were resolved by explicitly allowing both `http://localhost:5173` and `https://swap-slot.vercel.app` in the backend CORS configuration and validating tokens in the socket connection handshake. The project design emphasizes simplicity, modularity, and real-time interactivity while maintaining clean separation between frontend and backend logic.
