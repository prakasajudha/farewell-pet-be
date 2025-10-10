import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Configuration } from "../../core/models/Configuration";

export class ConfigurationSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const configurationsRepository = dataSource.getRepository(Configuration);
        const count = await configurationsRepository.count();

        if (count > 0) {
            return;
        }

        const configurations: Partial<Configuration>[] = [];

        const configCodes = [
            "SHOW_INDIVIDUAL_MESSAGE",
            "SHOW_ALL_MESSAGE",
            "SEND_MESSAGE",
            "SHOW_LEADER_BOARD"
        ];

        configCodes.forEach(code => {
            configurations.push({
                id: uuidv4(),
                code,
                is_active: code === "SEND_MESSAGE" ? true : false,
                created_by: "system",
                created_at: new Date(),
                updated_by: "system",
                updated_at: new Date(),
                deleted_by: null,
                deleted_at: null
            });
        });

        await configurationsRepository.save(configurations);
    }
}