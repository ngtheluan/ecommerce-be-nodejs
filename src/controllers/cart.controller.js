const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.respone')

class CartController {
	/**
	 * add to cart
	 * @param {int} userId
	 * @param {*} res
	 * @param {*} next
	 * @method POST
	 * @url v1/api/cart
	 */
	addToCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create new succcess !',
			metadata: await CartService.addToCart(req.body),
		}).send(res)
		next()
	}

	update = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update succcess !',
			metadata: await CartService.addToCartV2(req.body),
		}).send(res)
		next()
	}

	deleteUserCartItem = async (req, res, next) => {
		new SuccessResponse({
			message: 'Delete card succcess !',
			metadata: await CartService.deleteUserCartItem(req.body),
		}).send(res)
		next()
	}

	getListCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list cart succcess !',
			metadata: await CartService.getListCart(req.query),
		}).send(res)
		next()
	}
}

module.exports = new CartController()
