import { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("users")
        .addColumn('id', "integer", col => col.primaryKey().autoIncrement().notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .addColumn("lastname", "varchar(20)")
        .addColumn("email", "varchar(50)", col => col.unique().notNull())
        .addColumn("password", "varchar(60)", col => col.notNull())
        .addColumn("confirmed", "boolean",col => col.defaultTo(`0`))
        .execute()

    await db.schema
        .createTable("classes")
        .addColumn('id', "integer", col => col.primaryKey().autoIncrement().notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .execute()
        
    await db.schema
        .createTable("categorys")
        .addColumn('id', "integer", col => col.primaryKey().autoIncrement().notNull())
        .addColumn("name", "varchar(20)", col => col.notNull())
        .execute()

    await db.schema
        .createTable("finances")
        .addColumn('id', "integer", col => col.primaryKey().autoIncrement().notNull())
        .addColumn("class", "integer", col => col.notNull().references("classes.id"))
        .addColumn("name", "varchar(20)", col => col.notNull())
        .addColumn("category", "integer", col => col.notNull().references("categorys.id"))
        .addColumn("income", "numeric(8, 2)")
        .addColumn("expenditure", "numeric(8, 2)")
        .addColumn("user", "integer", col => col.notNull().references("users.id"))
        .addColumn("month", "integer", col => col.notNull())
        .addColumn("year", "integer", col => col.notNull())
        .execute()

    await db.schema
        .createTable("tokens")
        .addColumn('id', "integer", col => col.primaryKey().autoIncrement().notNull())
        .addColumn("token", "varchar(250)", col => col.notNull())
        .addColumn("user", "integer", col => col.notNull().references("users.id"))
        .execute()
}
    
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users").execute()
    await db.schema.dropTable("classes").execute()
    await db.schema.dropTable("categorys").execute()
    await db.schema.dropTable("finances").execute()
    await db.schema.dropTable("tokens").execute()
}