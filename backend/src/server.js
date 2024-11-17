import express from 'express'
import statusRouter from './routes/status.route.js'
import authRouter from './routes/auth.route.js'
import cors from 'cors'
import prodcutRouter from './routes/product.routes.js'
import mongoose from './config/db.config.js'
import errorHandlerMiddlerware from './middlewares/errorHandler.middlerware.js'

const PORT = 3000
const app = express()

app.use(cors())
//middlewere que habilita las consultas de origen cruzados

app.use(express.json())

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', prodcutRouter)


app.use(errorHandlerMiddlerware)

app.listen(PORT, () => {
    console.log(`El servidor se esta ejecutando en http://localhost:${PORT}`)
})
