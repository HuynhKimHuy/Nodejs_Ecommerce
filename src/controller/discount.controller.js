import ProductFactory from "../services/product.service.v2.js";
import { Created, OK } from "../core/success.response.js";
import DiscountService from "../services/discount.service.js";

class DiscountController {
    createDiscountCode = async (req, res) => {
        new Created({
            message: "Create discount code successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userID
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res) => {
        new OK({
            message: "Get all discount codes successfully",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userID,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res) => {
        new OK({
            message: "Get all discount codes with Product successfully",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    getDiscountAmout = async (req, res) => {
        new OK({
            message: "Get discount amount successfully",
            metadata: await DiscountService.getAllDiscountAmount({
                ...req.body,

            })
        }).send(res)
    }
}

export default new DiscountController()