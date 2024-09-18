import { db } from "../../config/db"
import { NewToken, Token } from "../../types"

export async function newToken(token: NewToken) {
    await db
        .insertInto("tokens")
        .values(token)
        .executeTakeFirstOrThrow()
}

export async function searchToken(token: Token["token"]): Promise<Pick<Token,"token"|"user">|undefined> {
    return await db
        .selectFrom("tokens")
        .select(["tokens.token", "tokens.user"])
        .where("token", "=", token)
        .executeTakeFirst()
}

export async function deleteToken(token: Token["token"]) {
    return await db
        .deleteFrom('tokens')
        .where('tokens.token', '=', token)
        .executeTakeFirstOrThrow()
}