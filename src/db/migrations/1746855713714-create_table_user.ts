import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUser1746855713714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar"
                },
                {
                    name: "is_admin",
                    type: "boolean"
                },
                {
                    name: "nickname",
                    type: "varchar"
                },
                {
                    name: "created_by",
                    type: "varchar"
                },
                {
                    name: "created_at",
                    type: "timestamp"
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
