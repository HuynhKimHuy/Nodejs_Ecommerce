import express from 'express'
import discountController from '../../controller/discount.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const DiscountRouter = express.Router()

// get amount a discount code can apply
DiscountRouter.post('/amount', asyncHandler(discountController.getDiscountAmout))
DiscountRouter.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

// authentication
DiscountRouter.use(authentication)
///// Create, update, delete

DiscountRouter.post('', asyncHandler(discountController.createDiscountCode))
DiscountRouter.get('', asyncHandler(discountController.getAllDiscountCodes))

export default DiscountRouter


