import { Request, Response } from "express"
import crypto from "crypto"
import { newCategory, showCategorys, deleteCategoryById, updateCategory, showCategoryById } from "../db/queries/OptionsQueries"
import { NewCategory, UpdateCategory } from "../types"

export class OptionsController {
    static createCategory = async (req: Request, res: Response) => {
        const { id } = req.user
        const { name } = req.body
        try {
            const categoryData: NewCategory = {
                id: crypto.randomUUID(),
                name,
                user: id
            }
            await newCategory(categoryData)
            res.send("Categoría creada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al crear la categoria"})
            console.log(error)
        }
    }

    static showAllCategorys = async (req: Request, res: Response) => {
        const { id } = req.user
        try {
            const categorys = await showCategorys(id)
            res.json(categorys)
        } catch (error) {
            res.status(500).json({error: "Hubo un error al buscar la categoría"})
            console.log(error)
        }
    }

    static showCategorByID = async (req: Request, res: Response) => {
        const { id } = req.category
        const { id: userId } = req.user
        try {
            const categorys = await showCategoryById(userId, id)
            res.json(categorys)
        } catch (error) {
            res.status(500).json({error: "Hubo un error al buscar la categoría"})
            console.log(error)
        }
    }

    static updateCategorys = async (req: Request, res: Response) => {
        const { id } = req.category
        const { id: userId } = req.user
        const { name } = req.body
        try {
            const CategoryData: UpdateCategory = {
                id,
                name,
                user: userId
            }
            await updateCategory(CategoryData)
            res.send("Categoría actualizada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error actualizar la categoría"})
            console.log(error)
        }
    }

    static deleteCategory = async (req: Request, res: Response) => {
        const { id } = req.category
        const { id: userId } = req.user
        try {
            await deleteCategoryById(userId, id)
            res.send("Categoria eliminada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al eliminar la categoría"})
            console.log(error)
        }
    }
}