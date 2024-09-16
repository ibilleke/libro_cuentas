import express from "express"
import AtuhRouter from "./routes/AuthRouter"

require('dotenv').config()

const app = express()

// Leer datos de formularios
app.use(express.json())

// Rutas
app.use("/api/auth", AtuhRouter)
// app.use("/api/income")
// app.use("/api/expenses")

export default app