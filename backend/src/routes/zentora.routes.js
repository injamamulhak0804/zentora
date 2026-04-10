import express from "express";
import {
  getZentora,
  createZentora,
  saveCanvas,
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
router.post("/user/save", saveCanvas);

export default router;
