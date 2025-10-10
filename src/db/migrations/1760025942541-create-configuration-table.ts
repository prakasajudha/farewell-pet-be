import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateConfigurationTable1760025942541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "configurations",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "code",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: false
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
                    name: "updated_by",
                    type: "varchar"
                },
                {
                    name: "updated_at",
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("configurations");
    }

}
