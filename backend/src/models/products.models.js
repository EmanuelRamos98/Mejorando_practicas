import mongoose from "mongoose";

const prodcutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    seller_id: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const Products = mongoose.model('Products', prodcutSchema)
export default Products