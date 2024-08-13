import mongoose, { Schema, Types, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        requiredd: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
    }, stock: {
        type: Number,
        default: 1
    }, price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainImage: {
        type: Object,
        required: true
    },
    finalPrice: {
        type: Number,
        require: true
    },
    discount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }

}, {
    timestamps: true
})

const ProductModel = mongoose.models.Product || model('Product', ProductSchema);
export default ProductModel;