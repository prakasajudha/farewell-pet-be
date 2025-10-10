import express from "express";
import * as configuration from "../../controllers/configuration-controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

// Get all configurations (public endpoint)
router.get("/", configuration.getAllConfigurations);

// Get configuration by code (public endpoint)
router.get("/:code", configuration.getConfiguration);

// Update configuration status (requires authentication)
router.put("/update", authMiddleware, configuration.updateConfigurationStatus);

export default router;
