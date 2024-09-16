import { Request, Response } from "express"
import { newUser, searchUser, searchUserSelectAll, updateUser } from "../queries/AuthQuery"
import { deleteToken, newToken, searchToken } from "../queries/TokenQuery"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { generarJWT } from "../utils/jwt"

export class AuthController {
    static createUSer = async (req: Request, res: Response) => {
        const { name, lastname, email, password} = req.body
        try {
            const validEmail = await searchUser(email)
            if(validEmail) {
                const error = new Error("El correo electrónico ya esta en uso")
                return res.status(404).json({error: error.message})
            }
            req.body.password = await hashPassword(password) 
            const data = {
                name,
                lastname,
                email,
                password: req.body.password
            }
            const user = await newUser(data)
            const newId = user.insertId.toString().split('n')
            const token = generateToken()
            const dataToken= {
                token,
                user: +newId[0]
            }
            await newToken(dataToken)
            res.send("Usuario crado correctamente, hemos enviado un correo electrónico para que verifiques tu cuenta")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al crear la cuenta"})
            console.log(error)
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await searchToken(token)
            if(!tokenExists) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            const user = await searchUser({id: tokenExists.user})
            user.confirmed = 1
            await Promise.allSettled([updateUser(user), deleteToken(tokenExists.token)])
            res.send("Cuenta confirmada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const user = await searchUserSelectAll(email)
            if(!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({error: error.message})
            }
            if(!user.confirmed) {
                const dataToken = {
                    token: generateToken(),
                    user: user.id
                }
                await newToken(dataToken)
                const error = new Error("La cuenta no ha sido verificada, hemos enviado un correo electrónico de verificación")
                return res.status(401).json({error: error.message})
            }
            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta")
                return res.status(404).json({error: error.message})
            }
            const token = generarJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error: "Hubo un error al ingresar a la cuenta"})
        }
    }

    static forgotPasword  = async (req: Request, res: Response) => {
        const { email } = req.body
        try {
            const user = await searchUser(email)
            if(!user) {
                const error = new Error("Correo electrónico no encontrado")
                return res.status(404).json({error: error.message})
            }
            const dataToken = {
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
            const { id } = await searchUser({id: validToken.user})
            req.body.password = await hashPassword(req.body.password)
            const dataUser = {
                id,
                password: req.body.password
            }
            await updateUser(dataUser)
            res.send("Contraseña actualizada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al cambiar la contraseña"})
            console.log(error)
        }
    }
}