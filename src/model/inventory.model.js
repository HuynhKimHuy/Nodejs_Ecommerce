
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

import mongoose from 'mongoose'
const { Schema, model } = mongoose

const InventorySchema = new Schema({
    inven_product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    inven_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    stock: { type: Number, required: true },
    inven_location: {
        type: String,
        default: 'unknown',
    },
    inven_stock: {
        type: Number,
        required: true,
    },
    inven_reservation: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const InventoryModel = model(DOCUMENT_NAME, InventorySchema)