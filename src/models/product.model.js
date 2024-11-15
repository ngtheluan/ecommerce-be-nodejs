'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const DOCUMENT_NAME_CLOTHING = 'Clothing'
const DOCUMENT_NAME_ELECTRONICS = 'Electronics'
const DOCUMENT_NAME_FURNITURE = 'Furniture'

// Declara the Schema of the Mongo model
const productSchema = new Schema(
	{
		product_name: { type: String, required: true },
		product_thumb: { type: String, required: true },
		product_description: String,
		product_price: { type: Number, required: true },
		product_quantity: { type: Number, required: true },
		product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
		product_attributes: { type: Schema.Types.Mixed, required: true },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
)

const clothingSchema = new Schema(
	{
		brand: { type: String, required: true },
		size: String,
		material: String,
	},
	{
		timestamps: true,
		collection: DOCUMENT_NAME_CLOTHING,
	}
)

const electronicSchema = new Schema(
	{
		manufacturer: { type: String, required: true },
		model: String,
		color: String,
	},
	{
		timestamps: true,
		collection: DOCUMENT_NAME_ELECTRONICS,
	}
)

const furnitureSchema = new Schema(
	{
		brand: { type: String, required: true },
		size: String,
		material: String,
	},
	{
		timestamps: true,
		collection: DOCUMENT_NAME_FURNITURE,
	}
)

module.exports = {
	product: model(DOCUMENT_NAME, productSchema),
	clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
	electronics: model(DOCUMENT_NAME_ELECTRONICS, electronicSchema),
	furniture: model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
}
