import { Router } from 'express'
import AccessRouter from './access/index.js'
import ShopRouter from './shop/index.js'
import ProductRouter from './product/index.js'
import DiscountRouter from './discount/index.js'
import { apiKey, permissions } from '../auth/checkAuth.js'

const router = Router()

// Signup is public - no apiKey required
router.use('/v1/api/shop/signup', ShopRouter)

// All other routes require apiKey
router.use(apiKey)
router.use(permissions('0000'))

router.use('/v1/api/discount',DiscountRouter)
router.use('/v1/api/product', ProductRouter)
router.use('/v1/api', AccessRouter)


export default router
