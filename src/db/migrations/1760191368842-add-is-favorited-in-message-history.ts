import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddIsFavoritedInMessageHistory1760191368842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("message_history", new TableColumn({
            name: "is_favorited",
            type: "boolean",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("message_history", "is_favorited");
    }

}
