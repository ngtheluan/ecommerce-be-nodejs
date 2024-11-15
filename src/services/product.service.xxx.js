'use strict'
const { clothing, electronics, product, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

//define Factory class to create Product
class ProductFactory {
	static productRegisty = {}

	static registerProductType(type, classRef) {
		ProductFactory.productRegisty[type] = classRef
	}

	static async createProduct(type, payload) {
		const productClass = ProductFactory.productRegisty[type]
		if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
		return new productClass(payload).createProduct()
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
		return await product.create({ ...this, _id: product_id })
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

//define sub class different product type Furniture
class Furniture extends Product {
	async createProduct() {
		const newFurniture = await furniture.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		})
		if (!newFurniture) throw new BadRequestError('Create new Electronics error !')

		const newProduct = await super.createProduct(newFurniture._id)
		if (!newProduct) throw new BadRequestError('Create new Product error !')

		return newProduct
	}
}

const DOCUMENT_NAME_CLOTHING = 'Clothing'
const DOCUMENT_NAME_ELECTRONICS = 'Electronics'
const DOCUMENT_NAME_FURNITURE = 'Furniture'

ProductFactory.registerProductType(DOCUMENT_NAME_ELECTRONICS, Electronics)
ProductFactory.registerProductType(DOCUMENT_NAME_CLOTHING, Clothing)
ProductFactory.registerProductType(DOCUMENT_NAME_FURNITURE, Furniture)

module.exports = ProductFactory
