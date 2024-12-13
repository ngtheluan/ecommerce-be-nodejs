'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema(
	{
		cart_state: {
			type: String,
			required: true,
			enum: ['active', 'completed', 'failed', 'pending'],
			default: 'active',
		},
		cart_products: {
			type: Array,
			required: true,
			default: [],
		},
		cart_userId: {
			type: Number,
			required: true,
		},
		cart_count_products: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
		collection: COLLECTION_NAME,
	}
)

module.exports = cartSchema
module.exports = model(DOCUMENT_NAME, cartSchema)
