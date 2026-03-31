import { Mongoose } from 'mongoose'
import { Product } from '../product.js'

export const queryProducts = async ({ query, limit = 50, skip = 0 }) => {
    return await Product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
}
export const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProducts({ query, limit, skip })
}
export const findPublishedProducts = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProducts({ query, limit, skip })
}

export const publicProductByShop = async ({product_shop, product_id})=>{
    const foundShop = await Product.findOne({
        product_shop: new Mongoose.Types.ObjectId(product_shop),
        _id: new Mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return 

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

export const unPublicProductByShop = async ({product_shop, product_id})=>{
    const foundShop = await Product.findOne({
        product_shop: new Mongoose.Types.ObjectId(product_shop),
        _id: new Mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return 

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}



