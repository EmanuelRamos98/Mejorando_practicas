import express from 'express'
import authMiddleware from '../middlewares/auth.middlerware.js'
import { createProductController, deleteProductController, getAllProductController, getProductByIdController, updateProductController } from '../controllers/product.controller.js'

const prodcutRouter = express.Router()

prodcutRouter.get('/:product_id', authMiddleware(['user', 'admin']), getProductByIdController)
prodcutRouter.get('/', authMiddleware(['user', 'admin']), getAllProductController)
prodcutRouter.post('/', authMiddleware(['admin']), createProductController)
prodcutRouter.put('/:product_id', authMiddleware(['admin']), updateProductController)
prodcutRouter.delete('/:product_id', authMiddleware(['admin']), deleteProductController)

export default prodcutRouter
