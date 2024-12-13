'use strict'
const { clothing, electronics, product, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
	findAllDraftsForShop,
	findAllPublishForShop,
	findAllProducts,
	findProduct,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
	updateProductById,
} = require('../models/repositories/product.repo')
const { removeUndefinedNullObject, updateNestedObject } = require('../utils/index')
const { insertInventory } = require('../models/repositories/inventory.repo')

const DOCUMENT_NAME_CLOTHING = 'Clothing'
const DOCUMENT_NAME_ELECTRONICS = 'Electronics'
const DOCUMENT_NAME_FURNITURE = 'Furniture'

//define Factory class to create Product
class ProductFactory {
	static productRegisty = {}

	static registerProductType(type, classRef) {
		ProductFactory.productRegisty[type] = classRef
	}

	//createProduct
	static async createProduct(type, payload) {
		const productClass = ProductFactory.productRegisty[type]
		if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
		return new productClass(payload).createProduct()
	}

	//updateProduct
	static async updateProduct(type, productId, payload) {
		const productClass = ProductFactory.productRegisty[type]
		if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
		return new productClass(payload).updateProduct(productId)
	}

	//findAllDraftsForShop
	static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isDraft: true }
		return await findAllDraftsForShop({
			query,
			limit,
			skip,
		})
	}

	//findAllPublishForShop
	static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isPublished: true }
		return await findAllPublishForShop({
			query,
			limit,
			skip,
		})
	}

	//publishProductByShop
	static async publishProductByShop({ product_shop, product_id }) {
		return await publishProductByShop({ product_shop, product_id })
	}

	//unPublishProductByShop
	static async unPublishProductByShop({ product_shop, product_id }) {
		return await unPublishProductByShop({ product_shop, product_id })
	}

	//getListSearchProduct
	static async getListSearchProduct({ keysearch }) {
		return await searchProductByUser({ keysearch })
	}

	//findAllProducts
	static async findAllProducts({
		limit = 50,
		sort = 'ctime',
		page = 1,
		filter = {
			isPublished: true,
		},
	}) {
		return await findAllProducts({
			limit,
			sort,
			page,
			filter,
			select: ['product_name', 'product_price', 'product_thumb', 'product_shop'],
		})
	}

	//findProduct
	static async findProduct({ product_id }) {
		return await findProduct({ product_id, unSelect: ['__v'] })
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

	//update product
	async updateProduct(productId, payload) {
		return await updateProductById({ productId, payload, model: product })
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

	//updateProduct
	async updateProduct(productId) {
		// remove attribute has null undefined
		const objectParams = removeUndefinedNullObject(this)

		// updated nested object
		const objectNestedParams = updateNestedObject(objectParams.product_attributes)

		if (objectParams.product_attributes) {
			//update child
			await updateProductById({
				productId,
				payload: objectNestedParams,
				model: clothing,
			})
		}

		//update Product
		const updateProduct = await super.updateProduct(productId, updateNestedObject(objectParams))
		return updateProduct
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

ProductFactory.registerProductType(DOCUMENT_NAME_ELECTRONICS, Electronics)
ProductFactory.registerProductType(DOCUMENT_NAME_CLOTHING, Clothing)
ProductFactory.registerProductType(DOCUMENT_NAME_FURNITURE, Furniture)

module.exports = ProductFactory
