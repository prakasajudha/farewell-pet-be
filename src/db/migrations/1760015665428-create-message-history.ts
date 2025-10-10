import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateMessageHistory1760015665428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "message_history",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "user_from",
                    type: "uuid"
                },
                {
                    name: "user_to",
                    type: "uuid"
                },
                {
                    name: "is_private",
                    type: "boolean",
                    default: false
                },
                {
                    name: "message",
                    type: "varchar"
                },
                {
                    name: "created_by",
                    type: "varchar"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "deleted_by",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "deleted_at",
                    type: "timestamp",
                    isNullable: true
                }
            ]
        }), true);

        // Add foreign key constraints
        await queryRunner.createForeignKey("message_history", new TableForeignKey({
            columnNames: ["user_from"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("message_history", new TableForeignKey({
            columnNames: ["user_to"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("message_history");
    }

}
