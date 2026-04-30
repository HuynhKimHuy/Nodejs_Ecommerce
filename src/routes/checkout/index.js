import express from 'express';
const CheckoutRouter = express.Router()
import { asyncHandler } from "../../helpers/asyncHandler.js";
import CheckoutController from '../../controller/checkout.controller.js'
CheckoutRouter.post("/review", asyncHandler(CheckoutController.checkoutReview))

export default CheckoutRouter