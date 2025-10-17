import { connection } from "../lib/database";
import { User } from "../core/models/User";
import emailService from "../core/services/email-service";

/**
 * Test script to send feature announcement email to one user
 * Run this script with: npm run test-feature-announcement
 */

const testFeatureAnnouncement = async () => {
    try {
        console.log("🧪 Testing feature announcement email...");

        // Initialize database connection
        if (!connection.isInitialized) {
            await connection.initialize();
            console.log("✅ Database connected");
        }

        // Test email connection first
        console.log("🔍 Testing email connection...");
        const emailTest = await emailService.testEmailConnection();
        if (!emailTest) {
            throw new Error("Email connection failed. Please check your SMTP settings.");
        }

        // Get the first user for testing
        const testUser = await User.findOne({
            select: ['id', 'name', 'email', 'nickname'],
            where: {
                deleted_at: null
            }
        });

        if (!testUser) {
            console.log("❌ No users found in database");
            return;
        }

        console.log(`📧 Sending test email to: ${testUser.email} (${testUser.name})`);

        // Send test email
        const result = await emailService.sendFeatureAnnouncement(
            testUser.email,
            testUser.name,
            process.env.APP_URL || 'https://bisikberbisik.com'
        );

        console.log("✅ Test email sent successfully!");
        console.log("📧 Message ID:", result.messageId);
        console.log("👤 Sent to:", testUser.email);
        console.log("📝 Check the email to see how it looks!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    } finally {
        // Close database connection
        if (connection.isInitialized) {
            await connection.destroy();
            console.log("\n🔌 Database connection closed");
        }
    }
};

// Run the test
testFeatureAnnouncement();
