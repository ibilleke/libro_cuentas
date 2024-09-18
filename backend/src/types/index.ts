import { Insertable, Selectable, Updateable } from "kysely"
import { Categorys, Finances, Tokens, Users } from "../models/Schema"

export type NewCategory= Insertable<Categorys>
export type Category = Selectable<Categorys>
export type UpdateCategory = Updateable<Categorys>

export type NewFinance = Insertable<Finances>
export type Finance = Selectable<Finances>
export type UpdateFianace = Updateable<Finances>

export type NewToken = Insertable<Tokens>
export type Token = Selectable<Tokens>
export type UpdateToken = Updateable<Tokens>

export type NewUser = Insertable<Users>
export type User = Selectable<Users>
export type UpdateUser = Updateable<Users>