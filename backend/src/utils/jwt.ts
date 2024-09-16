import jwt from "jsonwebtoken"
import { User } from "../types"

interface IUserPayload {
    id: User["id"]
}

export const generarJWT = (payload: IUserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
    return token
}