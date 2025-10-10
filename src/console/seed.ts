import { connection } from "../lib/database";
import { SeedCommand } from "./commands/SeedCommand";

async function runSeed() {
  const seedCommand = new SeedCommand(connection);
  await seedCommand.execute([]);
}

runSeed()
  .then(() => console.log("Seeding completed successfully"))
  .catch((error) => console.error("Error running seed:", error));
