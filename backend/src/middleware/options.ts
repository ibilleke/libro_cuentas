import { Request, Response, NextFunction } from "express"
import { showCategoryById } from "../db/queries/OptionsQueries"
import { Category } from "../types"

declare global {
    namespace Express {
        interface Request {
            category?: Category 
        }
    }
}

export async function validID(req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId } = req.params
        const { id: userId } = req.user
        const category = await showCategoryById(userId, categoryId)
        if(!category) {
            const error = new Error("Categoria no encontrada")
            return res.status(401).json({error: error.message})
        }
        req.category = category
        next()
    } catch (error) {
        res.status(500).json({error: "Acceso denegado"})
        console.log(error)
    }
}