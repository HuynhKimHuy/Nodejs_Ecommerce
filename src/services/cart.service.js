import { CartModel } from "../model/cart.model.js"
import { getProductById } from "../model/repositories/product.repo.js"
import { BadRequestError, NotFoundError } from "../core/error.respone.js"
class CartService {

    ///START REPO CART///
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" }
        const updateOrInsert = {
            $addToSet: {
                cart_products: product,
            }
        }
        const options = { upsert: true, new: true }
        return await CartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            cart_state: "active",
            "cart_products.productId": productId,
        }
        const update = {
            $inc: {
                "cart_products.$.quantity": quantity
            }
        }
        const options = { upsert: true, new: true }
        return await CartModel.findOneAndUpdate(query, update, options)
    }

    ///End REPO CART///
    static async addToCart({ userId, product = {} }) {
        // tìm cart của user
        const userCart = await CartModel.findOne({ cart_userId: userId })
        if (!userCart) {
            // nếu chưa có cart thì tạo mới
            return await CartService.createUserCart({ userId, product })
        }
        // Nếu đã có giỏ hàng nhưng chưa có sản phẩm 
        if (userCart.cart_products.length === 0) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        // Nếu đã có giỏ hàng và đã có sản phẩm thì cập nhật số lượng sản phẩm trong cart_products
        return await CartService.updateCartQuantity({ userId, product })
    }

    static async addToCartV2({ userId, shop_order_ids = [] }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_product[0] || {}
        //check xem sản phẩm có tồn tại không 
        const foundProduct = await getProductById({ productId })
        if (!foundProduct) throw new NotFoundError("Product not found")
        const productShopId = foundProduct.product_shop?.toString()
        const shopId = shop_order_ids[0]?.shopId?.toString()
        if (!productShopId || productShopId !== shopId) {
            throw new BadRequestError("Product does not belong to the shop")
        }
        if (quantity === 0) {
            // nếu số lượng sản phẩm bằng 0 thì xóa sản phẩm khỏi cart
            return await CartService.delectUserCart({ userId, productId })
        }

        return await CartService.updateCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async delectUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: "active",
        }
        const update = {
            $set: {
                cart_count_products: 0
            },
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        const delectCart = await CartModel.updateOne(query, update)
        return delectCart
    }

    static async getListCart({ userId }) {
        return await CartModel.findOne({ cart_userId: userId, cart_state: "active" })
    }

}

export default CartService