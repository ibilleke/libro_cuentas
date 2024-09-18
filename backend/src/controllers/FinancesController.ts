import { Request, Response } from "express"
import { createFinance } from "../db/queries/FinanceQuery"
import { NewFinance } from "../types"

export class FinanceController {
    static newFinance = async (req: Request, res: Response) => {
        const { class: classes, name, category, income, expediture, user} = req.body
        try {
            const fianceData: NewFinance = {

            }
            await createFinance(fianceData)
        } catch (error) {
            console.log(error)
        }
    }
}