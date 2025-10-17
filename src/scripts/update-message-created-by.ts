import { connection } from "../lib/database";
import { MessageHistory } from "../core/models/MessageHistory";
import { User } from "../core/models/User";

/**
 * Script to update all created_by values in message_history table to use sender nickname
 * Run this script with: npm run ts-node src/scripts/update-message-created-by.ts
 */

const updateMessageCreatedBy = async () => {
    try {
        console.log("🚀 Starting script to update message_history created_by to use sender nickname...");

        // Initialize database connection
        if (!connection.isInitialized) {
            await connection.initialize();
            console.log("✅ Database connected");
        }

        // Get all message history records
        const messages = await MessageHistory.find({
            relations: ['sender']
        });

        console.log(`📊 Found ${messages.length} message records to update`);

        if (messages.length === 0) {
            console.log("✅ No messages found, script completed");
            return;
        }

        let updatedCount = 0;
        let errorCount = 0;

        // Update each message
        for (const message of messages) {
            try {
                const oldCreatedBy = message.created_by;
                const newCreatedBy = message.sender?.nickname || "Anonymous";

                // Only update if the value is different
                if (oldCreatedBy !== newCreatedBy) {
                    message.created_by = newCreatedBy;
                    await message.save();
                    updatedCount++;

                    console.log(`✅ Updated message ${message.id}: "${oldCreatedBy}" → "${newCreatedBy}"`);
                } else {
                    console.log(`⏭️  Skipped message ${message.id}: already using nickname`);
                }
            } catch (error) {
                errorCount++;
                console.error(`❌ Error updating message ${message.id}:`, error);
            }
        }

        console.log("\n📈 Summary:");
        console.log(`  Total messages processed: ${messages.length}`);
        console.log(`  Successfully updated: ${updatedCount}`);
        console.log(`  Errors: ${errorCount}`);
        console.log(`  Skipped (already correct): ${messages.length - updatedCount - errorCount}`);

        // Verify the update
        console.log("\n🔍 Sample of updated records:");
        const sampleMessages = await MessageHistory.find({
            relations: ['sender'],
            take: 5,
            order: { created_at: 'DESC' }
        });

        sampleMessages.forEach((message, index) => {
            console.log(`  ${index + 1}. Message ID: ${message.id}`);
            console.log(`     Created by: ${message.created_by}`);
            console.log(`     Sender nickname: ${message.sender?.nickname || 'N/A'}`);
            console.log(`     Sender name: ${message.sender?.name || 'N/A'}`);
        });

        console.log("\n✅ Script completed successfully!");

    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    } finally {
        // Close database connection
        if (connection.isInitialized) {
            await connection.destroy();
            console.log("🔌 Database connection closed");
        }
    }
};

// Run the script
updateMessageCreatedBy();
