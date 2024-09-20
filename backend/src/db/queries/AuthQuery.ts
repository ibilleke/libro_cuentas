import { db } from "../../config/db"
import { NewUser, UpdateUser, User } from "../../types"

export async function newUser(user: NewUser) {
    return await db
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow()
}

export async function searchUserSelectAllbyEmail(email: User["email"]): Promise<User|undefined> {
    return await db
        .selectFrom("users")
        .select(["id","name","lastname","email","password","confirmed"])
        .where("email", "=", email)
        .executeTakeFirst()
}

export async function searchUserById(id: User["id"]): Promise<Pick<User,"id"|"name"|"lastname"|"email"|"confirmed">|undefined> {
    return await db
        .selectFrom("users")
        .select(["id", "name", "lastname", "email", "confirmed"])
        .where("id", "=", id)
        .executeTakeFirst()
}

export async function searchUserByEmail(email: User["email"]): Promise<Pick<User,"id"|"name"|"lastname"|"email"|"confirmed">|undefined> {
    return await db
        .selectFrom("users")
        .select(["id", "name", "lastname", "email", "confirmed"])
        .where("email", "=", email)
        .executeTakeFirst()
}

export async function updateUser(id: UpdateUser["id"], update: UpdateUser) {
    return await db
        .updateTable('users')
        .set(update)
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
}