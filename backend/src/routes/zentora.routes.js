import express from "express";
import {
  getZentora,
  createZentora
} from "../controllers/zentora.controller.js";

const router = express.Router();

// GET
router.get("/user", getZentora);

// POST
router.post("/user", createZentora);

export default router;