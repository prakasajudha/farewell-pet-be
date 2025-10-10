import { Request, Response } from "express";
import plantService from "../../core/services/plant-service";
import { AuthRequest } from "../middlewares/auth";
import { PlantType } from "../../core/models/Plant";
import { parseSortParam } from "../../util/sort";

export const show = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const plant = await plantService.show(id);
        return res.status(200).json({
            success: true,
            data: { plant },
            message: "Plant retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const browse = async (req: Request, res: Response) => {
    try {
        const { type, name, is_active, sort, page: pageParam, size: sizeParam, limit } = req.query;

        const page = parseInt(pageParam as string) || 1;
        const size = parseInt(sizeParam as string) || parseInt(limit as string) || 10;
        const offset = (page - 1) * size;

        let sortObj = {};
        if (sort) {
            sortObj = parseSortParam(sort as string);
        } else {
            sortObj = { created_at: 'DESC' };
        }

        const condition = {
            type: type as PlantType,
            name: name as string,
            is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined
        };

        const result = await plantService.browse(
            condition,
            sortObj,
            { size, offset }
        );

        const totalPages = Math.ceil(result.total / size);

        return res.status(200).json({
            success: true,
            data: {
                ...result,
                pagination: {
                    totalPages,
                    currentPage: page,
                    pageSize: size,
                    totalItems: result.total
                }
            },
            message: "Plants retrieved successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const create = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { name, type } = req.body;
        const plant = await plantService.create({
            name,
            type,
            created_by: req.user.name,
            updated_by: req.user.name
        });

        return res.status(200).json({
            success: true,
            data: { plant },
            message: "Plant created successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const update = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { id } = req.params;
        const { name, type } = req.body;

        const plant = await plantService.update(id, {
            name,
            type,
            updated_by: req.user.name
        });

        return res.status(200).json({
            success: true,
            data: { plant },
            message: "Plant updated successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const remove = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { id } = req.params;
        await plantService.remove(id, req.user.name);

        return res.status(200).json({
            success: true,
            data: null,
            message: "Plant deleted successfully"
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
}; 