import express from "express";
import * as message from "../../controllers/message-controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

router.get("/not-private", message.getAllNotPrivate);
router.get("/my-messages", message.getAllByUser);
router.get("/stats", message.getMessageStats);
router.get("/global-stats", message.getGlobalMessageStats);
router.post("/", message.createMessage);

export default router;
