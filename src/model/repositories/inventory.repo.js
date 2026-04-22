import { InventoryModel } from "../inventory.model.js"

export const insertInventory = async ({ productId, shopId, stock, location = "unknow" }) => {
    return await InventoryModel.create({
        inven_product_id: productId,
        inven_shop: shopId,
        stock: stock,
        inven_stock: stock,
        inven_location: location
    })
}