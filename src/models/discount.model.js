'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declara the Schema of the Mongo model
const discountSchema = new Schema(
	{
		discount_name: {
			type: String,
			required: true,
		},
		discount_description: {
			type: String,
			required: true,
		},
		discount_type: {
			type: String,
			required: true,
			default: 'fixed_amount',
		},
		discount_value: {
			type: Number,
			required: true,
		},
		discount_code: {
			type: String,
			required: true,
		},
		discount_start_date: {
			type: Date,
			required: true,
		},
		discount_end_date: {
			type: Date,
			required: true,
		},
		// số lượng tối đa discount được áp dụng
		discount_max_uses: {
			type: Number,
			required: true,
		},
		// số lượng discount đã sử dụng
		discount_uses_count: {
			type: Number,
			required: true,
		},
		// ai đã sử dụng
		discount_users_used: {
			type: Array,
			default: [],
		},
		// số lượng cho phép tối đa được dùng mỗi user
		discount_max_uses_per_user: {
			type: Number,
			required: true,
		},
		// giá trị đơn hàng tối thiểu
		discount_min_order_value: {
			type: Number,
			required: true,
		},
		discount_shopId: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		// được áp dụng discount không
		discount_is_active: {
			type: Boolean,
			default: true,
		},
		// discount áp dụng cho đối tượng : all, specific
		discount_applies_to: {
			type: String,
			required: true,
			enum: ['all', 'specific'],
		},
		// nếu đối tượng specific thì sử dụng array sản phẩm
		discount_product_ids: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
)

module.exports = model(DOCUMENT_NAME, discountSchema)
