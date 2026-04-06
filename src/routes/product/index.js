import express from 'express'
import productController from '../../controller/product.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUntil.js'

const ProductRouter = express.Router()
// search
ProductRouter.get('/search/:keySearch', asyncHandler(productController.getSearchProduct))
ProductRouter.get('', asyncHandler(productController.getAllProduct))
ProductRouter.get('/:product_id', asyncHandler(productController.getFindProducts))
// authenbtication
ProductRouter.use(authentication)

///// Create, update, delete
ProductRouter.post('', asyncHandler(productController.createProduct))
ProductRouter.patch('/:product_id', asyncHandler(productController.updateProduct))
ProductRouter.post('/publish/:id', asyncHandler(productController.putPublishedForShop))
ProductRouter.post('/unPublish/:id', asyncHandler(productController.unPublishedForShop))

// query
ProductRouter.get('/drafts/all', asyncHandler(productController.getDraftsForShop))
ProductRouter.get('/published/all', asyncHandler(productController.getPublishedForShop))


export default ProductRouter


