import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("users")
        .addColumn('id', "varchar(36)", col => col.primaryKey().notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .addColumn("lastname", "varchar(20)")
        .addColumn("email", "varchar(50)", col => col.unique().notNull())
        .addColumn("password", "varchar(60)", col => col.notNull())
        .addColumn("confirmed", "boolean",col => col.defaultTo(`0`))
        .execute()
        
    await db.schema
        .createTable("categorys")
        .addColumn('id', "varchar(36)", col => col.primaryKey().notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .addColumn("user", "varchar(36)", col => col.notNull().references("users.id"))
        .execute()

    await db.schema
        .createTable("finances")
        .addColumn('id', "varchar(36)", col => col.primaryKey().notNull())
        .addColumn('class', sql`enum('income', 'expenditure')`, col => col.notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .addColumn("category", "varchar(36)", col => col.notNull().references("categorys.id"))
        .addColumn("income", "numeric(8, 2)", col => col.defaultTo(`0`))
        .addColumn("expenditure", "numeric(8, 2)", col => col.defaultTo(`0`))
        .addColumn("user", "varchar(36)", col => col.notNull().references("users.id"))
        .addColumn("month", "integer", col => col.notNull())
        .addColumn("year", "integer", col => col.notNull())
        .execute()

    await db.schema
        .createTable("tokens")
        .addColumn('id', "varchar(36)", col => col.primaryKey().notNull())
        .addColumn("token", "varchar(6)", col => col.notNull())
        .addColumn("user", "varchar(36)", col => col.notNull().references("users.id"))
        .execute()
}
    
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users").execute()
    await db.schema.dropTable("categorys").execute()
    await db.schema.dropTable("finances").execute()
    await db.schema.dropTable("tokens").execute()
}