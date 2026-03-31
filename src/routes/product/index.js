import express from 'express'
import productController from '../../controller/product.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const ProductRouter = express.Router()
// search
ProductRouter.get('/search/:keySearch', asyncHandler(productController.getSearchProduct))

// authenbtication
ProductRouter.use(authentication)

/////
ProductRouter.post('', asyncHandler(productController.createProduct))
ProductRouter.post('publish/:id', asyncHandler(productController.putPublishedForShop))
ProductRouter.post('unPublish/:id', asyncHandler(productController.unPublishedForShop))

// query
ProductRouter.get('/drafts/all', asyncHandler(productController.getDraftsForShop))
ProductRouter.get('/pubished/all', asyncHandler(productController.getPublishedForShop))


export default ProductRouter


    