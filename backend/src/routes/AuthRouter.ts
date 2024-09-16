import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { handleInputErrors } from "../middleware/validation"
import { body, param } from "express-validator"

const router = Router()

router.post("/new-user",
    body("name")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({max: 60}).withMessage("El nombre debe contener máximo 20 caracteres"),
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido")
        .isLength({max: 50}).withMessage("El nombre debe contener máximo 50 caracteres"),
    body("password")
        .isLength({min: 8}).withMessage("La contraseña debe contener mínimo 8 caracteres")
        .isLength({max: 60}).withMessage("La contraseña debe contener máximo 60 caracteres"),
    body("password_confirmation")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Las contraseñas deben ser iguales")
            }
            return true
        }),
    handleInputErrors,
    AuthController.createUSer
)

router.post("/confirm-account",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacío"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
    handleInputErrors,
    AuthController.login
)

router.post("/forgot-password",
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    AuthController.forgotPasword
)

router.post("/change-password-email/:token",
    param("token")
        .isLength({min: 6}).withMessage("Token no válido"),
    body("password")
        .isLength({min: 8}).withMessage("La contraseña debe contener mínimo 8 caracteres")
        .isLength({max: 60}).withMessage("La contraseña debe contener máximo 60 caracteres"),
    body("password_confirmation")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Las contraseñas deben ser iguales")
            }
            return true
        }),
    handleInputErrors,
    AuthController.changePasswordEmail
)

export default router