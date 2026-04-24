import cartController from "../../controller/cart.controller.js";
import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from '../../auth/authUntil.js'
const CartRouter = express.Router()

CartRouter.post("", asyncHandler(cartController.addToCart))
CartRouter.delete("", asyncHandler(cartController.deleteCart))
CartRouter.post("/update", asyncHandler(cartController.updateCart))
CartRouter.get("", asyncHandler(cartController.getListCart))


export default CartRouter