import express from "express";
import * as user from "../../controllers/auth-controller"
import { authMiddleware } from "../../middlewares/auth"

const router = express.Router();
router.post("/login", user.auth)
router.post("/register", user.register)
router.get("/users", authMiddleware, user.getListAllUser)
router.get("/users/:id", authMiddleware, user.showUserById)
router.put("/change-password", authMiddleware, user.changePassword)

export default router;