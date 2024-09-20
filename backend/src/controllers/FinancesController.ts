import { Request, Response } from "express"
import crypto from "crypto"
import { createFinance } from "../db/queries/FinanceQuery"
import { NewFinance } from "../types"

export class FinanceController {
    static newFinance = async (req: Request, res: Response) => {
        const { class: classes, name, category, income, expenditure } = req.body
        
        try {
            const fianceData: NewFinance = {
                id: crypto.randomUUID(),
                class: classes,
                name,
                category,
                income,
                expenditure
            }
            await createFinance(fianceData)
        } catch (error) {
            console.log(error)
        }
    }
}