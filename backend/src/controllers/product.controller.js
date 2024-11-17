import ResponseBuilder from "../helpers/builders/response.builder.js";
import AppError from "../helpers/errors/app.error.js";
import ProductRepository from "../repositories/product.repository.js";

export const createProductController = async (req, res, next) => {
    try {
        const { new_product } = req.body
        if (!new_product) {
            return next(new AppError('Debe ingresar los datos correspondientes para crear un producto'), 400)
        }
        const create_product = await ProductRepository.createProduct(new_product)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Producto Creado')
            .setPayload({ state: create_product })
            .build()
        return res.status(201).json(response)
    } catch (error) {
        return next(error)
    }
}

export const deleteProductController = async (req, res, next) => {
    try {
        const { product_id } = req.params
        if (!product_id) {
            return next(new AppError('Se debe ingresar un product_id', 400))
        }
        const product = await ProductRepository.deleteProduct(product_id)
        if (!product) {
            return next(new AppError('No se encontro producto para eliminar', 404))
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Eliminado')
            .setPayload({ product_delete: product })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}


export const updateProductController = async (req, res, next) => {
    try {
        const { product_id } = req.params
        if (!product_id) {
            return next(new AppError('Se debe ingresar un product_id', 400))
        }
        const updated_data = req.body
        const product_updated = await ProductRepository.updateProduct(product_id, updated_data)
        if (!product_updated) {
            return next(new AppError('No se encontro el producto para actualizar', 404))
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('actualizado')
            .setPayload({ product_updated: product_updated })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}


export const getProductByIdController = async (req, res, next) => {
    try {
        const { product_id } = req.params
        const product = await ProductRepository.getProductById(product_id)
        if (!product) {
            //yo le puedo pasar a next el parametro para 'x' middleware
            return next(new AppError('Producto no encontrado', 404))
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('SUCCESS')
            .setPayload(product)
            .build()
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}

export const getAllProductController = async (req, res, next) => {
    try {
        const products = await ProductRepository.getAllProducts()
        if (!products) {
            return next(new AppError('No se encontro la lista de productos', 404))
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Lista Products')
            .setPayload({ products: products })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}









