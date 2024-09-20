import { Request, Response } from "express"
import crypto from "crypto"
import { newUser, searchUserByEmail, searchUserById, searchUserSelectAllbyEmail, updateUser } from "../db/queries/AuthQuery"
import { deleteToken, newToken, searchToken } from "../db/queries/TokenQuery"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { generarJWT } from "../utils/jwt"
import { NewToken, NewUser, UpdateUser } from "../types"

export class AuthController {
    static createUSer = async (req: Request, res: Response) => {
        try {
            const validEmail = await searchUserByEmail(req.body.email)
            if(validEmail) {
                const error = new Error("El correo electrónico ya esta en uso")
                return res.status(404).json({error: error.message})
            }
            req.body.password = await hashPassword(req.body.password) 
            const data: NewUser = {
                id: crypto.randomUUID(),
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            }
            const tokenData: NewToken = {
                id: crypto.randomUUID(),
                token: generateToken(),
                user: data.id
            }
            await Promise.allSettled([newUser(data), newToken(tokenData)])
            res.send("Usuario crado correctamente, hemos enviado un correo electrónico para que verifiques tu cuenta")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al crear la cuenta"})
            console.log(error)
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const tokenExists = await searchToken(req.body.token)
            if(!tokenExists) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            const { id } = await searchUserById(tokenExists.user)
            const updataData: UpdateUser = {
                confirmed: 1
            }
            await Promise.allSettled([updateUser(id, updataData), deleteToken(id)])
            res.send("Cuenta confirmada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const user = await searchUserSelectAllbyEmail(req.body.email)
            if(!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({error: error.message})
            }
            if(!user.confirmed) {
                const dataToken: NewToken = {
                    id: crypto.randomUUID(),
                    token: generateToken(),
                    user: user.id
                }
                await newToken(dataToken)
                const error = new Error("La cuenta no ha sido verificada, hemos enviado un correo electrónico de verificación")
                return res.status(401).json({error: error.message})
            }
            // Revisar password
            const isPasswordCorrect = await checkPassword(req.body.password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta")
                return res.status(404).json({error: error.message})
            }
            const tokenJWT = generarJWT({id: user.id})
            res.send(tokenJWT)
        } catch (error) {
            res.status(500).json({error: "Hubo un error al ingresar a la cuenta"})
        }
    }

    static forgotPasword  = async (req: Request, res: Response) => {
        try {
            const user = await searchUserByEmail(req.body.email)
            if(!user) {
                const error = new Error("Correo electrónico no encontrado")
                return res.status(404).json({error: error.message})
            }
            const dataToken: NewToken = {
                id: crypto.randomUUID(),
                token: generateToken(),
                user: user.id
            }
            await newToken(dataToken)
            res.send("Hemos envíado un correo electrónico con los pasos a seguir")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al solicitar el token"})
            console.log(error)
        }
    }

    static changePasswordEmail  = async (req: Request, res: Response) => {
        const { token } = req.params
        try {
            const validToken = await searchToken(token)
            if(!validToken) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            const [respUser, respPassword] = await Promise.allSettled([
                searchUserById(validToken.user),
                hashPassword(req.body.password)
            ])
            const userID = respUser.status === "fulfilled" ? respUser.value.id : ""
            const password = respPassword.status === "fulfilled" ? respPassword.value : ""
            const updateData: UpdateUser = {
                id: userID,
                password: password
            }
            await Promise.allSettled([updateUser(userID, updateData), deleteToken(userID)])
            res.send("Contraseña actualizada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al cambiar la contraseña"})
            console.log(error)
        }
    }
}