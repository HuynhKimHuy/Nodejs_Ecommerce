
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new mongoose.Schema({
    discount_name: {
        type: String,
        required: true,
        unique: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: "fixed_amount" // "percentage"
    },
    discount_value: {
        type: Number,
        required: true
    }, //10.000
    discount_code: {
        type: String,
        required: true,
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_uses: {
        type: Number,
        default: 0 //số lượng sử dụng tối đa, 0 là không giới hạn
    },
    discount_uses_count: {
        type: Number,
        required: true,
    }, // số lượng đã sử dụng
    discount_users_used: {
        type: Array,
        default: []
    }, // danh sách người dùng đã sử dụng mã giảm giá
    discount_max_uses_per_user: {
        type: Number,
        required: true,
        default: 0 //số lượng sử dụng tối đa cho mỗi người dùng, 0 là không giới hạn
    },
    discount_minimum_order_value: {
        type: Number,
        default: 0 // giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
    },
    discount_shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    discount_is_active: {
        type: Boolean,
        default: true // trạng thái hoạt động của mã giảm giá
    },
    discount_is_deleted: {
        type: Boolean,
        default: false // trạng thái xóa của mã giảm giá
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ["all", "specific"],
    },
    discount_product_ids: {
        type: Array,
        required: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema)

