import { Router } from "express"
import { body, param } from "express-validator"
import { authenticate } from "../middleware/auth"
import { OptionsController } from "../controllers/OptionsController"
import { handleInputErrors } from "../middleware/validation"
import { validID } from "../middleware/options"

const router = Router()

// Authenticated
router.use(authenticate)

router.post("/category/new",
    body("name")
        .notEmpty().withMessage("El nombre de la categoría es obligatoria")
        .isLength({max: 20}).withMessage("Solo se permiten 20 caracteres"),
    handleInputErrors,
    OptionsController.createCategory
)

router.get("/category/show-all", 
    handleInputErrors,
    OptionsController.showAllCategorys
)

// Valida ID de la categoria
router.param("categoryId", validID)

router.get("/category/show/:categoryId",
    param("categoryId")
        .notEmpty().withMessage("ID obligatorio"),
    handleInputErrors,
    OptionsController.showCategorByID
)

router.put("/category/update/:categoryId",
    param("categoryId")
        .notEmpty().withMessage("ID obligatorio"),
    handleInputErrors,
    OptionsController.updateCategorys
)

router.delete("/category/delete/:categoryId",
    param("categoryId")
        .notEmpty().withMessage("ID obligatorio"),
    handleInputErrors,
    OptionsController.deleteCategory
)

export default router