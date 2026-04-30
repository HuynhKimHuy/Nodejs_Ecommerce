import { OK } from "../core/success.response.js"
import CheckoutService from "../services/checkout.service.js"


class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new OK({
            message: "Checkout Review success",
            statusCode: 200,
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

export default new CheckoutController()