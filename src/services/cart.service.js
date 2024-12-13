'use strict'
const cartModel = require('../models/cart.model')
const { NotFoundError } = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

class CartService {
	static async createUserCart({ userId, product = {} }) {
		const query = { cart_userId: userId, cart_state: 'active' }
		const updateOrInsert = {
			$addToSet: {
				cart_products: product,
			},
		}
		const option = { upsert: true, new: true }
		return await cartModel.findOneAndUpdate(query, updateOrInsert, option)
	}

	// 1 - Add Product to Cart [User]
	static async addToCart({ userId, product = {} }) {
		const userCart = await cartModel.findOne({
			cart_userId: userId,
		})
		if (!userCart) {
			return await CartService.createUserCart({ userId, product })
		}

		// nếu có giỏ hàng rồi nhưng chưa có sản phẩm ?
		if (!userCart.cart_products.length) {
			userCart.cart_products = [product]
			return await userCart.save()
		}

		//giỏ hàng tồn tại, và có sản phẩm thì update số lượng
		return await CartService.updateUserCartQuantity({ userId, product })
	}

	/* 1 : Add Product to Cart [User] - version 2
        shop_order_ids : [{
            shopId,
            item_products : [{
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            },version]
        }]
    */
	static async addToCartV2({ userId, shop_order_ids }) {
		const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

		const foundProduct = await getProductById(productId)
		if (!foundProduct) throw new NotFoundError('Product not exist !')

		if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
			throw new NotFoundError('Product do not belong to this shop !')

		if (quantity === 0) {
			//delete
		}

		return await CartService.updateUserCartQuantity({
			userId,
			product: {
				productId,
				quantity: quantity - old_quantity,
			},
		})
	}

	// 2 + 3 : Reduce + Increase Product Quantity [User]
	static async updateUserCartQuantity({ userId, product }) {
		const { productId, quantity } = product

		const query = {
			cart_userId: userId,
			'cart_products.productId': productId,
			cart_state: 'active',
		}
		const updateOrInsert = {
			$inc: {
				'cart_products.$.quantity': quantity,
			},
		}

		const option = { upsert: true, new: true }
		return await cartModel.findOneAndUpdate(query, updateOrInsert, option)
	}

	// 4 - Get List to Cart [User]
	static async getListCart({ userId }) {
		return await cartModel
			.findOne({
				cart_userId: +userId,
			})
			.lean()
	}

	// 6 - Delete Cart Item [User]
	static async deleteUserCartItem({ userId, productId }) {
		const query = {
			cart_userId: userId,
			cart_state: 'active',
		}
		const updateSet = {
			$pull: {
				cart_products: {
					productId,
				},
			},
		}
		const deleteCart = await cartModel.updateOne(query, updateSet)
		return deleteCart
	}
}

module.exports = CartService
