import express from 'express'
import productController from '../../controller/product.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const ProductRouter = express.Router()

ProductRouter.use(authentication)
ProductRouter.post('', asyncHandler(productController.createProduct))
ProductRouter.get('/drafts/all', asyncHandler(productController.getDraftsForShop))
export default ProductRouter
