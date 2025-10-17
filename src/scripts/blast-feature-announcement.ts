import { connection } from "../lib/database";
import { User } from "../core/models/User";
import emailService from "../core/services/email-service";

/**
 * Script to blast feature announcement email to all users
 * Run this script with: npm run blast-feature-announcement
 */

const blastFeatureAnnouncement = async () => {
    try {
        console.log("🚀 Starting feature announcement email blast...");

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

        // Get all users from database
        const users = await User.find({
            select: ['id', 'name', 'email', 'nickname'],
            where: {
                // Only get users that are not deleted
                deleted_at: null
            }
        });

        console.log(`📊 Found ${users.length} users to send emails to`);

        if (users.length === 0) {
            console.log("✅ No users found, script completed");
            return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: Array<{ email: string, error: string }> = [];

        // Process users in batches to avoid overwhelming the email server
        const batchSize = 10;
        const batches = [];
        for (let i = 0; i < users.length; i += batchSize) {
            batches.push(users.slice(i, i + batchSize));
        }

        console.log(`📦 Processing ${batches.length} batches of ${batchSize} users each`);

        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            console.log(`\n📤 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} users)...`);

            // Process batch concurrently
            const batchPromises = batch.map(async (user) => {
                try {
                    console.log(`📧 Sending to ${user.email} (${user.name})...`);

                    await emailService.sendFeatureAnnouncement(
                        user.email,
                        user.name,
                        process.env.APP_URL || 'https://bisikberbisik.com'
                    );

                    successCount++;
                    console.log(`✅ Sent to ${user.email}`);

                    // Add delay between emails to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (error) {
                    errorCount++;
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    errors.push({ email: user.email, error: errorMsg });
                    console.error(`❌ Failed to send to ${user.email}: ${errorMsg}`);
                }
            });

            // Wait for batch to complete
            await Promise.all(batchPromises);

            // Add delay between batches
            if (batchIndex < batches.length - 1) {
                console.log(`⏳ Waiting 5 seconds before next batch...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        // Print summary
        console.log("\n" + "=".repeat(60));
        console.log("📈 EMAIL BLAST SUMMARY");
        console.log("=".repeat(60));
        console.log(`📊 Total users processed: ${users.length}`);
        console.log(`✅ Successfully sent: ${successCount}`);
        console.log(`❌ Failed to send: ${errorCount}`);
        console.log(`📦 Total batches: ${batches.length}`);

        if (errors.length > 0) {
            console.log("\n❌ ERRORS DETAILS:");
            console.log("-".repeat(40));
            errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.email}: ${error.error}`);
            });
        }

        if (successCount > 0) {
            console.log("\n🎉 Feature announcement emails sent successfully!");
            console.log("📧 Users should receive emails about the new features:");
            console.log("   • Nickname display in messages");
            console.log("   • Email notifications for private messages");
        }

    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    } finally {
        // Close database connection
        if (connection.isInitialized) {
            await connection.destroy();
            console.log("\n🔌 Database connection closed");
        }
    }
};

// Add confirmation prompt
const confirmBlast = async () => {
    console.log("⚠️  WARNING: This will send emails to ALL users in the database!");
    console.log("📧 Make sure you have:");
    console.log("   • Valid SMTP configuration");
    console.log("   • Email template ready");
    console.log("   • Permission to send bulk emails");
    console.log("\nPress Ctrl+C to cancel, or wait 10 seconds to continue...");

    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("\n🚀 Starting email blast...");
    await blastFeatureAnnouncement();
};

// Run the script
confirmBlast();
