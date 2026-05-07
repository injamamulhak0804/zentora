import express from "express";
import {
  getZentora,
  createZentora,
  saveCanvas,
  getCanvas,
  signOut,
  getLoginWithGoogle,
} from "../controllers/zentora.controller.js";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// POST
router.post("/user/signin", getZentora);

// POST
router.post("/user/signup", createZentora);

//GET
router.get("/verify", verifyAuth);

//POST
router.post("/user/logout", signOut);

//POST
router.post("/user/save", saveCanvas);

//GET
router.get("/data", getCanvas);

//POST
router.post("/auth/google", getLoginWithGoogle);

export default router;
