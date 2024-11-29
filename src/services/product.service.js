'use strict'
const { clothing, electronics, product } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { insertInventory } = require('../models/repositories/inventory.repo')

//define Factory class to create Product
class ProductFactory {
	static async createProduct(type, payload) {
		switch (type) {
			case 'Electronics':
				return new Electronics(payload).createProduct()
			case 'Clothing':
				return new Clothing(payload).createProduct()
			default:
				throw new BadRequestError(`Invalid product type ${type}`)
		}
	}
}

//define base Product class
class Product {
	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_type,
		product_shop,
		product_attributes,
	}) {
		this.product_name = product_name
		this.product_thumb = product_thumb
		this.product_description = product_description
		this.product_price = product_price
		this.product_quantity = product_quantity
		this.product_type = product_type
		this.product_shop = product_shop
		this.product_attributes = product_attributes
	}

	//create new product
	async createProduct(product_id) {
		const newProduct = await product.create({ ...this, _id: product_id })

		if (newProduct) {
			//add product_stock in inventory collection
			await insertInventory({
				productId: newProduct._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			})
		}
		return newProduct
	}
}

//define sub class different product type Clothing
class Clothing extends Product {
	async createProduct() {
		const newClothing = await clothing.create(this.product_attributes)
		if (!newClothing) throw new BadRequestError('Create new Clothing error !')
		const newProduct = await super.createProduct()
		if (!newProduct) throw new BadRequestError('Create new Product error !')
		return newProduct
	}
}

//define sub class different product type Electronics
class Electronics extends Product {
	async createProduct() {
		const newElectronics = await electronics.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		})
		if (!newElectronics) throw new BadRequestError('Create new Electronics error !')

		const newProduct = await super.createProduct(newElectronics._id)
		if (!newProduct) throw new BadRequestError('Create new Product error !')

		return newProduct
	}
}

module.exports = ProductFactory
