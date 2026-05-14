import express from "express";
import dotenv from "dotenv";
import zentoraRoutes from "./routes/zentora.routes.js";
import { connectDB } from "./config/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
connectDB();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "https://zentora.vercel.app",
//       "https://zamam-zentora.vercel.app",
//       "https://zamam-zentora-frontend.vercel.app/",
//       "https://zamam-zentora-frontend.vercel.app/auth",
//       "https://zentora.zamam.in",
//       "http://127.0.0.1:8000", // Optional, but keep if you test via 127.0.0.1
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://zentora.vercel.app",
      "https://zamam-zentora.vercel.app",
      "https://zamam-zentora-frontend.vercel.app", // Removed slash
      "https://zentora.zamam.in", // Base domain only
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Use this syntax to catch all routes without crashing the parser
app.options("/(.*)", cors());

//Routes
app.use("/api/v1", zentoraRoutes);

app.get("/", (req, res) => {
  res.send("Please use /api/v1 for endpoints");
});

// app.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

// Keep your app.listen for local development
// if (process.env.NODE_ENV !== 'production') {
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// }

// CRITICAL: Export the app for Vercel
export default app;
