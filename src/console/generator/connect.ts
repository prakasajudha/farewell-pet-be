import { connection } from "../../lib/database"

export const dbconnect = async (model: string) => {
    await connection.initialize()
    const tables = await connection.query(`select * from information_schema.columns where table_name = '${model}'`)
    await connection.close()

    return tables
}