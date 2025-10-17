import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateMessageHistoryCreatedByToNickname1760662556157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Starting migration: Update message_history created_by to use sender nickname...");

        // First, let's check if there are any message_history records
        const messageCount = await queryRunner.query(`
            SELECT COUNT(*) as count FROM message_history
        `);

        console.log(`📊 Found ${messageCount[0].count} message records to update`);

        if (messageCount[0].count === 0) {
            console.log("✅ No messages found, migration completed");
            return;
        }

        // Update all message_history records to use sender nickname instead of UUID
        const updateResult = await queryRunner.query(`
            UPDATE message_history 
            SET created_by = COALESCE(u.nickname, 'Anonymous')
            FROM users u
            WHERE message_history.user_from = u.id
        `);

        console.log(`✅ Updated ${updateResult[1]} message records with sender nicknames`);

        // Verify the update
        const verifyResult = await queryRunner.query(`
            SELECT 
                mh.id,
                mh.created_by,
                u.nickname as sender_nickname,
                u.name as sender_name
            FROM message_history mh
            LEFT JOIN users u ON mh.user_from = u.id
            LIMIT 5
        `);

        console.log("🔍 Sample of updated records:");
        verifyResult.forEach((record: any, index: number) => {
            console.log(`  ${index + 1}. Message ID: ${record.id}`);
            console.log(`     Created by: ${record.created_by}`);
            console.log(`     Sender nickname: ${record.sender_nickname}`);
            console.log(`     Sender name: ${record.sender_name}`);
        });

        console.log("✅ Migration completed successfully!");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Reverting migration: Restore message_history created_by to use sender UUID...");

        // This is a destructive operation, so we'll restore using the user_from field
        // since that contains the original UUID
        const updateResult = await queryRunner.query(`
            UPDATE message_history 
            SET created_by = user_from
        `);

        console.log(`✅ Reverted ${updateResult[1]} message records to use sender UUIDs`);
        console.log("⚠️  Note: This assumes created_by was originally set to user_from UUID");
    }
}
