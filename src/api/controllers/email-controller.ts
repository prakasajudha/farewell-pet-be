import { Request, Response } from "express";
import emailService from "../../core/services/email-service";
import { AuthRequest } from "../middlewares/auth";

// Test email connection
export const testEmailConnection = async (req: Request, res: Response) => {
    try {
        console.log("🔍 Testing email connection...");
        const isConnected = await emailService.testEmailConnection();

        if (isConnected) {
            return res.status(200).json({
                success: true,
                message: "Email connection successful"
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Email connection failed"
            });
        }
    } catch (error: any) {
        console.error("❌ Email connection test error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Email connection test failed"
        });
    }
};

// Test send email notification (for testing purposes)
export const testSendEmail = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { recipient_email, recipient_name, sender_nickname } = req.body;

        if (!recipient_email || !recipient_name || !sender_nickname) {
            return res.status(400).json({
                success: false,
                message: "recipient_email, recipient_name, and sender_nickname are required"
            });
        }

        console.log("📧 Testing email notification...");
        const result = await emailService.sendPrivateMessageNotification(
            recipient_email,
            recipient_name,
            sender_nickname
        );

        return res.status(200).json({
            success: true,
            data: result,
            message: "Test email sent successfully"
        });
    } catch (error: any) {
        console.error("❌ Test email error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send test email"
        });
    }
};
