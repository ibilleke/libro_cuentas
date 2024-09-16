import { Kysely, MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import path from "path"
import { DB } from "../models/Schema"

require('dotenv').config({
  path: path.resolve(__dirname, "../../.env")
})

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.SERVER_DATABASE,
    host: process.env.SERVER_HOST,
    user: process.env.SERVER_USER,
    password: process.env.SERVER_PASSWORD,
    port: +process.env.SERVER_PORT,
    connectionLimit: 10,
  })
})

export const db = new Kysely<DB>({dialect})