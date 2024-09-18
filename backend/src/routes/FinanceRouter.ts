import { Router } from "express"
import { handleInputErrors } from "../middleware/validation"
import { FinanceController } from "../controllers/FinancesController"

const router = Router()

router.post("/create-finance", 
    handleInputErrors,
    FinanceController.newFinance
)

export default router