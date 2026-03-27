import mongoose from 'mongoose'
import slugify from 'slugify'
const { model, Schema } = mongoose

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
    {
        product_name: { type: String, required: true }, //quàn sì xịn
        product_thumb: { type: String, required: true },
        product_description: String,
        product_slug: String, //quan-si-xin
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Furniture']
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true
        },
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1.0, 'Rating must be above 1.0'],
            max: [5.0, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10 // làm tròn đến 1 chữ số thập phân
        },
        product_variants: {
            type:Array,
            default:[]

        },
        isDraft: { type: Boolean, default: true, index: true ,select:false},
        isPublished: { type: Boolean, default: false, index: true ,select:false}
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)

//DOcument middleware chạy trước khi save vào database
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


const electronicSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        manufacturer: { type: String, required: true },
        size: String,
        color: String
    },
    {
        collection: 'electronics',
        timestamps: true
    }
)

const clothingSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, required: true },
        size: String,
        material: String
    },
    {
        collection: 'clothes',
        timestamps: true
    }
)

const furnitureSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, required: true },
        size: String,
        material: String
    },
    {
        collection: 'Furnitures',
        timestamps: true
    }
)

export const Product = model(DOCUMENT_NAME, productSchema)

export const Electronic = model('Electronic', electronicSchema)

export const Clothing = model('Clothing', clothingSchema)

export const Furniture = model('Furniture', furnitureSchema)
