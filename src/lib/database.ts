import "reflect-metadata"
import { DataSource } from "typeorm"
import { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_LOG } from "../config/config"

export const connection = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    logging: DB_LOG,
    entities: ['./src/core/models/*.ts'],
    migrations: ['./src/db/migrations/*.ts'],
})
