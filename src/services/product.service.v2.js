import { Product as ProductModel, Electronic as ElectronicModel, Clothing as ClothingModel, Furniture as FurnitureModel } from '../model/product.js'
import { BadRequestError } from '../core/error.respone.js'
import { findAllDraftsForShop, publicProductByShop, unPublicProductByShop, searchProductByUser} from '../model/repositories/product.repo.js'
class ProductFactory {

    static productRegistry = {}

    static regisProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload = {}) {
        const productClass = ProductFactory.productRegistry[type]
        return new productClass(payload).createProduct()
    }

    // query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })

    }

    static async findPublicProductByShop({ product_shop, product_id }) {
        const query = { product_shop, ispublished: true, isDraft: false }
        return await findPublishedProducts({ query, product_id })
    }

    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    //Put 
    static async putPublishedForShop({ product_shop, product_id }) {
        return await publicProductByShop({ product_shop, product_id })
    }

    static async unPutPublishedForShop({ product_shop, product_id }) {
        return await unPublicProductByShop({ product_shop, product_id })
    }

    static async searchProduct({ keySearch }) {

    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    } = {}) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        const payload = {
            product_name: this.product_name,
            product_thumb: this.product_thumb,
            product_description: this.product_description,
            product_price: this.product_price,
            product_quantity: this.product_quantity,
            product_type: this.product_type,
            product_shop: this.product_shop,
            product_attributes: product_id ?? this.product_attributes
        }
        if (product_id) payload._id = product_id
        return await ProductModel.create(payload)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await ClothingModel.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create Clothings Error')
        const newPrduct = await super.createProduct(newClothing._id)
        return newPrduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await FurnitureModel.create(this.product_attributes)
        if (!newFurniture) throw new BadRequestError('create Furniture Error')

        const newPrduct = await super.createProduct(newFurniture._id)
        return newPrduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await ElectronicModel.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('create Electronic Error')

        const newPrduct = await super.createProduct(newElectronic._id)
        return newPrduct
    }
}

ProductFactory.regisProductType('Electronic', Electronic)
ProductFactory.regisProductType('Furniture', Furniture)
ProductFactory.regisProductType('Clothing', Clothing)
export default ProductFactory
