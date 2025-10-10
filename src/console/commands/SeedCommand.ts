// src/console/commands/seed.ts
import { DataSource } from "typeorm";
import { DatabaseSeeder } from "../../db/seeders";

export class SeedCommand {
  constructor(private dataSource: DataSource) {}
  
  public async execute(args: string[]): Promise<void> {
    try {
      await this.dataSource.initialize();
      
      const seeder = new DatabaseSeeder();
      
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        await seeder.run(this.dataSource);
      });
      
      await this.dataSource.destroy();
    } catch (error) {
      console.error("Error during seeding:", error);
      process.exit(1);
    }
  }
}