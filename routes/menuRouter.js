import express from "express";
import { addMenu, getDishesByMood } from "../controllers/menuController.js";
const router = express.Router();
router.post("/:restaurantId", addMenu);
router.get("/mood/:mood", getDishesByMood);
export default router;
