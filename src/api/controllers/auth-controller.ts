import { Request, Response } from "express";
import authService from "../../core/services/auth-service";
import { AuthRequest } from "../middlewares/auth";

export const auth = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return res.status(200).json({
            success: true,
            data: result,
            message: "Login successful"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, nickname } = req.body;
        const user = await authService.register(name, email, password, nickname);
        return res.status(200).json({
            success: true,
            data: user,
            message: "User registered successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getListAllUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const users = await authService.getAllUsers();
        return res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const showUserById = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { id } = req.params;
        const user = await authService.getUserById(id);
        return res.status(200).json({
            success: true,
            data: user,
            message: "User retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { old_password, new_password } = req.body;
        const result = await authService.changePassword(req.user.id, old_password, new_password);

        return res.status(200).json({
            success: true,
            data: result,
            message: "Password changed successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};
