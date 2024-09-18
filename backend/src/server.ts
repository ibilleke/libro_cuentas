import express from "express"
import AuthRouter from "./routes/AuthRouter"
import OptionsRouter from "./routes/OptionsRouter"
import FinanceRouter from "./routes/FinanceRouter"

require('dotenv').config()

const app = express()

// Leer datos de formularios
app.use(express.json())

// Rutas
app.use("/api/auth", AuthRouter)
app.use("/api/options/", OptionsRouter)
app.use("/api/finance/", FinanceRouter)

export default app