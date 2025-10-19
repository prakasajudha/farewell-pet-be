import { Router } from "express";
import { testEmailConnection, testSendEmail, testSendRegistrationEmail } from "../../controllers/email-controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Test email connection (public endpoint for testing)
router.get("/test-connection", testEmailConnection);

// Test send email notification (protected endpoint)
router.post("/test-send", authMiddleware, testSendEmail);

// Test send registration confirmation email (public endpoint for testing)
router.post("/test-registration-email", testSendRegistrationEmail);

export default router;
