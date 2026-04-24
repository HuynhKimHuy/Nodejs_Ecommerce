import mongoose from "mongoose";
const { Schema, model } = mongoose

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema({
    cart_state: {
        type: String,
        enum: ["active", "completed", "failed", "pending"],
        default: "active"
    },
    cart_products: {
        type: Array,
        default: [],
        required: true
    },
    cart_count_products: {
        type: Number,
        default: 0,
        required: true
    },
    cart_userId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const CartModel = model(DOCUMENT_NAME, cartSchema)