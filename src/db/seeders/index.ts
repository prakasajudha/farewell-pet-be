import { DataSource } from "typeorm";
import { PlantSeeder } from "./PlantSeeder";
import { ConfigurationSeeder } from "./ConfigurationSeeder";

export class DatabaseSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    await new ConfigurationSeeder().run(dataSource);
    await new PlantSeeder().run(dataSource);
  }
}