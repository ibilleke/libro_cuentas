import { Migrator, FileMigrationProvider } from "kysely"
import { promises as fs } from "fs"
import * as path from "path"
import { db } from "../../config/db"

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, "migration")
    })
})

async function migrationAll() {
    const { error, results } = await migrator.migrateToLatest()
    results?.forEach(result => {
        if(result.status === "Success") {
            console.log(`Migracion ${result.migrationName} ha sido exitosa!`)
        } else if (result.status === "Error") {
            console.log(`Migracion ${result.migrationName} ha fallado!`)
        }
    })
    if(error) {
        console.log("Error en la migración no se puede continuar")
        console.log(error)
        process.exit(1)
    }
    return await db.destroy()
}

migrationAll()