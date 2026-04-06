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

    updateProduct = async (req, res, next) => {
        new Created({
            message: 'Update product success',
            statusCode: 200,
            metadata: await ProductFactory.updateProduct(req.body.product_type,req.params.product_id,
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
            statusCode: 200,
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userID,
            })
        }).send(res)
    }

    getAllProduct = async (req, res, next) => {
        new Created({
            message: 'Get all product success',
            statusCode: 200,
            metadata: await ProductFactory.findAllProduct(req.query)
        }).send(res)
    }

    getFindProducts = async (req, res, next) => {
        new Created({
            message: 'Get product success',
            statusCode: 200,
            metadata: await ProductFactory.findProducts({
                product_id: req.params.product_id,

            })
        }).send(res)
    }

    getPublishedForShop = async (req, res, next) => {
        new Created({
            message: 'Get published for shop success',
            statusCode: 200,
            metadata: await ProductFactory.findPublicProductByShop({
                product_shop: req.user.userID,
            })
        }).send(res)
    }

    putPublishedForShop = async (req, res, next) => {
        new Created({
            message: 'Put published for shop success',
            statusCode: 200,
            metadata: await ProductFactory.putPublishedForShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishedForShop = async (req, res, next) => {
        new Created({
            message: 'Put unpublished for shop success',
            statusCode: 200,
            metadata: await ProductFactory.unPutPublishedForShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }

    getSearchProduct = async (req, res, next) => {
        new Created({
            message: 'Search product success',
            statusCode: 200,
            metadata: await ProductFactory.searchProductByUser({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }
}


export default new ProductController()
