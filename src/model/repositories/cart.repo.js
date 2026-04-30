
import { CartModel } from "../cart.model.js"
import { convertToObjectId } from "../../untils/getShopdata.js"

export const findCartById = async ({ cartId }) => {
    return await CartModel.findById({ _id: convertToObjectId(cartId), cart_state: "active" }).lean()
}

