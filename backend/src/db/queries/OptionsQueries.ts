import { db } from "../../config/db";
import { Category, NewCategory, UpdateCategory, User } from "../../types";

export async function newCategory(category: NewCategory) {
    return await db
        .insertInto("categorys")
        .values(category)
        .executeTakeFirstOrThrow()
}

export async function showCategorys(user: Category["user"]): Promise<Category[]|undefined> {
    return await db
        .selectFrom("categorys")
        .selectAll()
        .where("user", "=", user)
        .execute()
}

export async function showCategoryById(userId: User["id"], categoryId: Category["id"]): Promise<Category|undefined> {
    return await db
        .selectFrom("categorys")
        .selectAll()
        .where("user", "=", userId)
        .where("id", "=", categoryId)
        .executeTakeFirst()
}

export async function updateCategory(category: UpdateCategory) {
    const { name, id, user } = category
    return await db
        .updateTable("categorys")
        .set({name})
        .where("user", "=", user)
        .where("id", "=", id)
        .executeTakeFirstOrThrow()
}

export async function deleteCategoryById(userId: User["id"], categoryId: Category["id"]) {
    await db
        .deleteFrom("categorys")
        .where("user", "=", userId)
        .where("id", "=", categoryId)
        .executeTakeFirst()
}