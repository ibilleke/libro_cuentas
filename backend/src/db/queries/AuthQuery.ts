import { db } from "../../config/db"
import { NewUser, UpdateUser, User } from "../../types"

export async function newUser(user: NewUser) {
    return await db
        .insertInto("users")
        .values(user)
        .executeTakeFirstOrThrow()
}

export async function searchUserSelectAll(criteria: Partial<User>): Promise<User|undefined> {
    let query = db
        .selectFrom("users")
        .selectAll()
    if(criteria.id) query.where("id", "=", criteria.id)
    if(criteria.email) query.where("email", "=", criteria.email)
    return await query.executeTakeFirst()
}

export async function searchUser(criteria: Partial<User>): Promise<Pick<User,"id"|"name"|"lastname"|"email"|"confirmed">|undefined> {
    let query = db
        .selectFrom("users")
        .select(["id", "name", "lastname", "email", "confirmed"])
    if(criteria.id) query.where("id", "=", criteria.id)
    if(criteria.email) query.where("email", "=", criteria.email)
    return await query.executeTakeFirst()
}

export async function updateUser(user: UpdateUser) {
    return await db
        .updateTable('users')
        .set(user)
        .where('id', '=', user.id)
        .executeTakeFirstOrThrow()
}