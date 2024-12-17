'use strict'
const { findCartById } = require('../models/repositories/cart.repo')
const { BadRequestError } = require('../core/error.response')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')

class CheckOutService {
	/*{
	    cartId,
	    userId,
	    shop_order_ids: [
            {
                shopId,
                shop_discounts : [{ shopId, discountId, codeId }],
                item_products : [{ price, quantity, productId }],
            }
        ]
	}*/
	static async checkOutReview({ cartId, userId, shop_order_ids = [] }) {
		const foundCart = await findCartById(cartId)
		if (!foundCart) throw new BadRequestError('Cart not exist !')

		const checkout_order = {
			totalPrice: 0, // tổng tiền hàng
			feeShip: 0, // phí giao hàng
			totalDiscount: 0, // tổng tiền giảm giá
			totalCheckout: 0, // tổng thanh toán
		}

		const shop_order_ids_new = []

		// tính tổng tiền hoá đơn
		for (let i = 0; i < shop_order_ids.length; i++) {
			const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i] || {}

			// kiểm tra product có hợp lệ không ?
			const checkProductServer = await checkProductByServer(item_products)

			if (!checkProductServer[0]) throw new BadRequestError('Product not exist !')

			// tổng tiền đơn hàng
			const checkOutPrice = checkProductServer.reduce((acc, item) => {
				return acc + item.price * item.quantity
			}, 0)

			// tổng tiền trước khi xử lý
			checkout_order.totalPrice += checkOutPrice
			const itemCheckout = {
				shopId,
				shop_discounts,
				priceRaw: checkOutPrice, // tổng giá trị trước khi giảm giá
				priceApplyDiscount: checkOutPrice, // tiền sau khi giảm giá
				item_products: checkProductServer,
			}

			// nếu shop_discount tồn tại > 0, check xem có hợp lệ hay không
			if (shop_discounts.length > 0) {
				// giả sử có 1 discount
				const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
					codeId: shop_discounts[0].codeId,
					userId,
					shopId,
					products: checkProductServer,
				})

				// tổng cộng discount giảm giá
				checkout_order.totalDiscount += discount

				// nếu tiền giảm giá > 0
				if (discount > 0) {
					itemCheckout.priceApplyDiscount = checkOutPrice - discount
				}

				// tổng thanh toán cuối cùng
				checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
				shop_order_ids_new.push(itemCheckout)
			}
		}
		return {
			shop_order_ids,
			shop_order_ids_new,
			checkout_order,
		}
	}
}

module.exports = CheckOutService
