import express from "express";
import * as leaderboard from "../../controllers/leaderboard-controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

// All leaderboard routes require authentication
router.use(authMiddleware);

router.get("/", leaderboard.getLeaderboard);

export default router;
