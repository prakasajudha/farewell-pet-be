import { Request, Response } from "express";
import messageService from "../../core/services/message-service";
import { AuthRequest } from "../middlewares/auth";

export const getAllNotPrivate = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const messages = await messageService.getAllNotPrivate();
        return res.status(200).json({
            success: true,
            data: messages,
            message: "Non-private messages retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getAllByUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const messages = await messageService.getAllByUser(req.user.id);
        return res.status(200).json({
            success: true,
            data: messages,
            message: "User messages retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getFavoritedMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const messages = await messageService.getFavoritedMessages(req.user.id);
        return res.status(200).json({
            success: true,
            data: messages,
            message: "Favorited messages retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getMessageStats = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const stats = await messageService.getMessageStats(req.user.id);
        return res.status(200).json({
            success: true,
            data: stats,
            message: "Message statistics retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getGlobalMessageStats = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const stats = await messageService.getGlobalMessageStats();
        return res.status(200).json({
            success: true,
            data: stats,
            message: "Global message statistics retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { recipient_to, is_private, message } = req.body;
        const newMessage = await messageService.createMessage(
            req.user.id,
            recipient_to,
            is_private,
            message
        );

        return res.status(200).json({
            success: true,
            data: newMessage,
            message: "Message created successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { message_id } = req.body;

        if (!message_id) {
            return res.status(400).json({ message: "message_id is required" });
        }

        const result = await messageService.toggleFavorite(message_id, req.user.id);

        return res.status(200).json({
            success: true,
            data: result,
            message: `Message ${result.is_favorited ? 'favorited' : 'unfavorited'} successfully`
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};