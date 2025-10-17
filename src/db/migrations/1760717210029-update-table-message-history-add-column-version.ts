import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateTableMessageHistoryAddColumnVersion1760717210029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Adding version column to message_history table...");

        await queryRunner.query(`
            ALTER TABLE message_history 
            ADD COLUMN version INTEGER NOT NULL DEFAULT 1
        `);

        console.log("✅ Version column added successfully");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Removing version column from message_history table...");

        await queryRunner.query(`
            ALTER TABLE message_history 
            DROP COLUMN version
        `);

        console.log("✅ Version column removed successfully");
    }

}
