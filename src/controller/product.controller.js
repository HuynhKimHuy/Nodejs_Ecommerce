import { Created } from "../core/success.response.js"
import ProductFactory from "../services/product.service.v2.js"

class ProductController {
    createProduct = async (req, res, next) => {
      
        new Created({
            message: 'Create product success',
            statusCode: 201,
            metadata: await ProductFactory.createProduct(req.body.product_type,
               {
                ...req.body,
                product_shop: req.user.userID
               }
            )
        }).send(res)
    }

    //Query//
    /**
     * @desc Get all drafts for a shop
     * @param {Number} limit - Number of drafts to return 
     * @param {Number} skip - Number of drafts to skip for pagination 
     * @param {Json} filter - Filter criteria for drafts (e.g., by category, price range) 
     */
    getDraftsForShop = async (req, res, next) => {
        new Created({
            message: 'Get drafts for shop success',
            statusCode: 201,
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userID,
            })
        }).send(res)
    }



}


export default new ProductController()
