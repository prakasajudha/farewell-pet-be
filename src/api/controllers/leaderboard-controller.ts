import { Request, Response } from "express";
import leaderboardService from "../../core/services/leaderboard-service";
import { AuthRequest } from "../middlewares/auth";

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const leaderboard = await leaderboardService.getTopUsersByMessageCount();

        return res.status(200).json({
            success: true,
            data: leaderboard,
            message: "Leaderboard retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting leaderboard:", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error"
        });
    }
};
