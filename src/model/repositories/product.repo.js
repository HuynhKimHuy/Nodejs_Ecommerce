import mongoose from 'mongoose'
import { Product } from '../product.js'
import { convertToObjectId, getSelectFields, getUnSelectFields } from '../../untils/getShopdata.js'

export const queryProducts = async ({ query, limit = 50, skip = 0 }) => {
    return await Product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
}

export const updateProductById = async ({ product_id, updateBody, model, isNew = true }) => {
    return await model.findOneAndUpdate({ _id: product_id }, updateBody, { new: isNew })
}

export const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProducts({ query, limit, skip })
}


export const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortOption = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select(getSelectFields({ fields: select }))
        .lean()
}

export const findProducts = async ({ product_id, unSelect }) => {
    return await Product.findById(product_id).select(getUnSelectFields(unSelect)).lean()
}

export const getProductById = async ({ productId }) => {
    return await Product.findById({ _id: convertToObjectId(productId) }).lean()
}

export const findPublishedProducts = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProducts({ query, limit, skip })
}

export const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const result = await Product.find({
        $text: { $search: regexSearch },

    }, {
        score: { $meta: 'textScore' }
    })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return result
}


export const publicProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await Product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return

    foundShop.isDraft = false
    foundShop.isPublished = true
    await foundShop.save()
    return foundShop
}

export const unPublicProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await Product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return

    foundShop.isDraft = true
    foundShop.isPublished = false
    await foundShop.save()
    return { modifiedCount: 1 }
}

export const checkProductByServer = async (products = []) => {
    return await Promise.all(
        products.map(async (product) => {
            const foundProduct = await getProductById({ productId: product.productId })
            if (!foundProduct) return null
            return {
                productId: product.productId,
                price: foundProduct.product_price,
                product_shop: foundProduct.product_shop,
                quantity: product.quantity
            }
        })
    )

}


