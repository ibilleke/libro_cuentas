import { db } from "../../config/db";
import { Finance, NewFinance } from "../../types";

export async function createFinance(finance: NewFinance) {
    return await db
        .insertInto("finances")
        .values(finance)
        .executeTakeFirstOrThrow()
}