import { knex } from "knex"
import dotenv from "dotenv"

dotenv.config()

export abstract class BaseDatabase {
    protected static connection = knex({
        client: "pg",
        connection: process.env.DATABASE_URL,
        useNullAsDefault: true,
        pool: {
            min: 2,
            max: 10,
        }
    })
}