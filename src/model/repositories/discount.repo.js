import { Product } from "../product.js"
// limt : số bản ghi mõi trang , 
// page : trang hiện tại
// sort : sắp xếp theo ngày tạo mới nhất (ctime) hoặc cũ nhất (ctime_asc)
// filter : điều kiện lọc sản phẩm
// select : trường muốn lấy 

import { getSelectFields, getUnSelectFields } from "../../untils/getShopdata.js"
import { DiscountModel } from "../discout.model.js"

export const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = "ctime", filter, unSelect, model }) => {
    const skip = (page - 1) * limit // số bản ghi cần bỏ qua để lấy đúng trang hiện tại
    const sortOption = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const product = await model.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectFields(unSelect))
        .lean()
    return product
}

export const findDiscountCodesSelect = async ({ limit = 50, page = 1, sort = "ctime", filter, Select }) => {
    const skip = (page - 1) * limit // số bản ghi cần bỏ qua để lấy đúng trang hiện tại
    const sortOption = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const product = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select(getSelectFields(Select))
        .lean()
    return product
}

export const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}