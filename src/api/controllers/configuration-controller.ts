import { Request, Response } from "express";
import configurationService from "../../core/services/configuration-service";
import { AuthRequest } from "../middlewares/auth";

export const getAllConfigurations = async (req: Request, res: Response) => {
    try {
        const configurations = await configurationService.getAllConfigurations();

        return res.status(200).json({
            success: true,
            data: configurations,
            message: "All configurations retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getConfiguration = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const configuration = await configurationService.getByCode(code);

        return res.status(200).json({
            success: true,
            data: configuration,
            message: "Configuration retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateConfigurationStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { code, is_active } = req.body;

        if (!code) {
            return res.status(400).json({ message: "code is required" });
        }

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: "is_active must be a boolean value" });
        }

        const configuration = await configurationService.updateIsActive(
            code,
            is_active,
            req.user.email
        );

        return res.status(200).json({
            success: true,
            data: configuration,
            message: "Configuration status updated successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};
