import { Created, OK } from "../core/success.response.js";
import CartService from "../services/cart.service.js";
class CartController {
    addToCart = async (req, res) => {
        new Created({
            message: "Add to cart successfully",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res) => {
        new OK({
            message: "Update cart successfully",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    deleteCart = async (req, res) => {
        new OK({
            message: "Update cart successfully",
            metadata: await CartService.delectUserCart(req.body)
        }).send(res)
    }
    
    getListCart = async (req, res) => {
        new OK({
            message: "Get list cart successfully",
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

export default new CartController()