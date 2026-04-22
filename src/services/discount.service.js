

/**
 * discount service
 * 1-Generate discount code[ Shop || admin]
 * 2-Get discount anount [User]
 * 3-Get all discount code [User || Shop ||]
 * 4-verify discount code [User]
 * 5-Delete discount code [Shop || admin]
 * 6-Cancel discount code [Shop || admin]
 * 
 */
import { convertToObjectId } from "../untils/getShopdata.js"
import { DiscountModel } from "../model/discout.model.js"
import ProductFactory from "./product.service.v2.js"
import { findAllDiscountCodesUnSelect, findDiscountCodesSelect, checkDiscountExists } from "../model/repositories/discount.repo.js"
import lodash from "lodash"
import { NotFoundError } from "../core/error.respone.js"

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, users_used, shopId, minimum_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload

        // Chỉ kiểm tra start_date < end_date, không kiểm tra current date
        if (new Date(start_date) > new Date(end_date)) {
            throw new Error("Invalid discount code: start date must be before end date")
        }

        // created index for discount
        const founDiscount = await DiscountModel.findOne({ discount_code: code, discount_shop_id: convertToObjectId(shopId) }).lean()

        if (founDiscount && founDiscount.discount_is_active) {
            throw new Error("Discount code already exists")
        }

        const newDiscount = await DiscountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_minimum_order_value: minimum_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_users_used: users_used,
            discount_shop_id: shopId,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "specific" ? product_ids : [],
            discount_is_active: is_active || true,
            discount_max_uses: max_uses || 0,
            discount_uses_count: uses_count || 0,
            discount_max_uses_per_user: max_uses_per_user || 0
        })

        return newDiscount
    }

    static async updateDiscountCode(discountId, payload) {
        
    }

    static async getAllDiscountCodeWithProduct({ code, shopId, page, limit }) {

        const foundDiscounts = await DiscountModel.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectId(shopId),
        }).lean()

        if (!foundDiscounts || !foundDiscounts.discount_is_active) {
            throw new Error("Discount code not found or not active")
        }
        const { discount_applies_to, discount_product_ids } = foundDiscounts
        let products
        // nếu product dành cho tát cả mọi người thì trả về tất cả sản phẩm của shop đó, còn nếu dành cho sản phẩm cụ thể thì trả về những sản phẩm có id nằm trong discount_product_ids
        if (discount_applies_to === "all") {
            products = await ProductFactory.findAllProduct({
                page: +page,
                limit: +limit,
                filter: { isPublished: true, product_shop: convertToObjectId(shopId) },
                sort: 'ctime',
                select: ['product_name']
            })
        }

        // nếu discount_applies_to === "specific" thì trả về những sản phẩm có id nằm trong discount_product_ids
        if (discount_applies_to === "specific") {

            products = await ProductFactory.findAllProduct({
                page: +page,
                limit: +limit,
                filter: {
                    _id: { $in: discount_product_ids.map(id => convertToObjectId(id)) },
                    isPublished: true,
                    product_shop: convertToObjectId(shopId)
                },
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products

    }

    static async getAllDiscountCodeByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertToObjectId(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_users_used', 'discount_uses_count'],
            model: DiscountModel
        })
        return discounts
    }

    // 1- Kiểm tra xem mã giảm giá có tồn tại và hợp lệ không
    // 2- Tính tổng giá trị đơn hàng dựa trên sản phẩm và số lượng
    // 3- Kiểm tra xem tổng giá trị đơn hàng có đáp ứng yêu cầu giá trị tối thiểu của mã giảm giá không
    // 4- Nếu mã giảm giá áp dụng cho tất cả sản phẩm, tính toán số tiền giảm dựa trên tổng giá trị đơn hàng
    // 5- Nếu mã giảm giá áp dụng cho sản phẩm cụ thể, tính toán số tiền giảm dựa trên tổng giá trị của các sản phẩm được áp dụng mã giảm giá
    static async getAllDiscountAmount({ codeId, shopId, userId, products }) {
        // tìm kiếm discount dựa trên mã giảm giá 
        const foundDiscount = await checkDiscountExists({
            model: DiscountModel,
            filter: {
                discount_code: codeId,
                discount_shop_id: convertToObjectId(shopId),
            }
        })
        if (!foundDiscount) {
            throw new NotFoundError("Discount code not found or not active")
        }

        // lấy ra mã giảm giá , số lần sử dụng tối đa  , giá trị đơn hàng tối thiếu sử dụng 
        const {
            discount_is_active,
            discount_max_uses,
            discount_minimum_order_value,
            discount_uses_count,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
            discount_max_value
        } = foundDiscount

        //if mã giảm giá không tồn tại hoặc không hoạt động thì trả về lỗi
        if (!discount_is_active) throw new NotFoundError("Discount code not found or not active")
        // nếu mã giảm giá đã đạt đến số lần sử dụng tối đa thì trả về lỗi
        if (discount_max_uses && discount_uses_count >= discount_max_uses)
            throw new NotFoundError("Discount code has reached maximum uses")

        // kiểm tra xem mã giảm giá có đang trong thời gian áp dụng hay không
        // Nếu ngày tạo nhỏ hơn ngày bắt đầu hoặc lớn hơn ngày kết thúc thì mã giảm giá không hợp lệ
        if (new Date() < new Date(foundDiscount.discount_start_date) || new Date() > new Date(foundDiscount.discount_end_date)) {
            throw new NotFoundError("Discount code not found or not active")
        }

        // luôn tính tổng đơn hàng từ products
        const totalOrder = (products || []).reduce((total, product) => {
            return total + (product.quantity * product.price)
        }, 0)

        if (totalOrder < discount_minimum_order_value) {
            throw new NotFoundError(`Total order must be at least ${discount_minimum_order_value} to apply this discount code`)
        }

        // nếu mã giảm giá có giới hạn số lần sử dụng tối đa cho mỗi người dùng > 0 thì kiểm tra xem người dùng đã sử dụng mã giảm giá này bao nhiêu lần
        if (discount_max_uses_per_user > 0) {
            const userUsedCount = discount_users_used.find(user => user.userId.toString() === userId.toString())
            if (userUsedCount) {
                ///
            }

        }

        // check xem discount_applies_to là all hay specific để tính toán số tiền giảm
        const safeDiscountValue = Number(discount_value) || 0
        const safePercent = Math.min(Math.max(safeDiscountValue, 0), 100)

        let amount = discount_type === "percentage"
            ? totalOrder * (safePercent / 100)
            : Math.max(safeDiscountValue, 0)

        // nếu có giới hạn số tiền giảm tối đa, áp dụng cap
        if (discount_max_value && discount_max_value > 0) {
            amount = Math.min(amount, discount_max_value)
        }

        // không cho số tiền giảm vượt quá tổng đơn hàng
        amount = Math.min(amount, totalOrder)

        return {
            totalOrder,
            discount: amount,
            totalPrice: Math.max(totalOrder - amount, 0)
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {

        const delected = await DiscountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shop_id: convertToObjectId(shopId),
        })
        return delected
    }

    static async cancelDiscountCode(codeId, shopId, userId) {
        const founDiscount = await checkDiscountExists({
            model: DiscountModel,
            filter: {
                discount_code: codeId,
                discount_shop_id: convertToObjectId(shopId),
            }
        })
        if (!founDiscount) throw new NotFoundError("Discount code not found or not active")
        const result = await DiscountModel.findOneAndUpdate(founDiscount._id, {
            $pull: {
                discount_users_used: { userId: convertToObjectId(userId) }
            },
            $inc: {
                discount_uses_count: -1,
                discount_max_uses: 1
            }
        })
        return result
    }

}
export default DiscountService