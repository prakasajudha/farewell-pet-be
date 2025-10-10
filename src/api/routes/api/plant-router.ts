import express from "express";
import * as plant from "../../controllers/plant-controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

// Protected routes
router.use(authMiddleware);
router.get("/", plant.browse);
router.get("/:id", plant.show);
router.post("/", plant.create);
router.put("/:id", plant.update);
router.delete("/:id", plant.remove);

export default router;