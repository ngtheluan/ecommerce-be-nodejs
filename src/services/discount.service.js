'use strict'
const discountModel = require('../models/discount.model')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { convertToObjectId } = require('../utils/index')
const { findAllProducts } = require('./product.service.xxx')
const {
	findAllDiscountCodesUnUsed,
	checkDiscountExists,
	findAllDiscountCodesSelect,
} = require('../models/repositories/discount.repo')

class DiscountService {
	//1 - Generator Discount Code [Shop | Admin]
	static async createDiscount(payload) {
		const {
			code,
			start_date,
			end_date,
			is_active,
			shopId,
			min_order_value,
			product_ids,
			applies_to,
			name,
			description,
			type,
			max_value,
			max_uses,
			value,
			user_count,
			users_used,
			max_uses_per_user,
		} = payload

		if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
			throw new BadRequestError('Discount is expired !')
		}

		if (new Date(start_date) >= new Date(end_date)) {
			throw new BadRequestError('Start date must be less than end date !')
		}

		//create index for discount code
		const foundDiscount = discountModel
			.findOne({
				discount_code: code,
				discount_shopId: convertToObjectId(shopId),
			})
			.lean()

		if (foundDiscount && foundDiscount.discount_is_active === true) {
			throw new BadRequestError('Discount code already exists !')
		}

		const newDiscount = await discountModel.create({
			discount_name: name,
			discount_description: description,
			discount_type: type,
			discount_code: code,
			discount_value: value,
			discount_min_order_value: min_order_value || 0,
			discount_max_value: max_value,
			discount_start_date: new Date(start_date),
			discount_end_date: new Date(end_date),
			discount_max_uses: max_uses,
			discount_uses_count: user_count,
			discount_users_used: users_used,
			discount_is_active: is_active,
			discount_shopId: shopId,
			discount_applies_to: applies_to,
			discount_max_uses_per_user: max_uses_per_user,
			discount_product_ids: applies_to === 'all' ? [] : product_ids,
		})

		return newDiscount
	}

	//2 - Get all discount codes [User Shop]
	static async getAllDiscountCodeByShop({ limit, page, shopId }) {
		const discounts = await findAllDiscountCodesSelect({
			limit: +limit,
			page: +page,
			filter: {
				discount_shopId: convertToObjectId(shopId),
				discount_is_active: true,
			},
			select: ['discount_code', 'discount_name'],
			model: discountModel,
		})

		return discounts
	}

	//3 - Get all product by discount code [User]
	static async getAllDiscountCodeWithProducts({ code, shopId, limit, page }) {
		// create index for discount code
		const foundDiscount = await discountModel
			.findOne({
				discount_code: code,
				discount_shopId: convertToObjectId(shopId),
			})
			.lean()

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundError('Discount not exists !')
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount
		let products

		if (discount_applies_to === 'all') {
			// get all products
			products = await findAllProducts({
				filter: {
					product_shop: convertToObjectId(shopId),
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			})
		}

		if (discount_applies_to === 'specific') {
			// get the products ids
			products = await findAllProducts({
				filter: {
					_id: { $in: discount_product_ids },
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			})
		}

		return products
	}

	//4 - Get discount amount [User]
	static async getDiscountAmount({ codeId, userId, shopId, products }) {
		const foundDiscount = await checkDiscountExists({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_shopId: convertToObjectId(shopId),
			},
		})

		if (!foundDiscount) throw new NotFoundError(`Discount code doesn't exist !`)

		const {
			discount_is_active,
			discount_max_uses,
			discount_min_order_value,
			discount_max_uses_per_user,
			discount_users_used,
			discount_type,
			discount_value,
			discount_start_date,
			discount_end_date,
		} = foundDiscount

		if (!discount_is_active) throw new BadRequestError(`Discount code doesn't active !`)

		if (!discount_max_uses) throw new BadRequestError(`Discount are out !`)

		if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
			throw new BadRequestError('Discount is expired !')
		}

		// check has min order value
		let totalOrder = 0
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + product.quantity * product.price
			}, 0)
		}
		if (totalOrder < discount_min_order_value) {
			throw new BadRequestError(
				`Order value is less than min order value of ${discount_min_order_value}!`
			)
		}
		if (discount_max_uses_per_user > 0) {
			const userDiscount = discount_users_used.find((user) => user.userId === userId)
			if (userDiscount) {
			}
		}

		const amount =
			discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

		return { totalOrder, discount: amount, totalPrice: totalOrder - amount }
	}

	//5 - Delete discount Code [Admin | Shop]
	static async deleteDiscountCode({ codeId, shopId }) {
		const deleted = await discountModel.findOneAndDelete({
			discount_code: codeId,
			discount_shopId: convertToObjectId(shopId),
		})

		return deleted
	}

	//6 - Cancel discount Code [User]
	static async cancelDiscountCode({ codeId, shopId, userId }) {
		const foundDiscount = await checkDiscountExists({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_shopId: convertToObjectId(shopId),
			},
		})

		if (!foundDiscount) throw new BadRequestError('Discount code not found !')

		const result = await discountModel.findByIdAndUpdate({
			$pull: {
				discount_users_used: userId,
			},
			$inc: {
				discount_max_uses: 1,
				discount_uses_count: -1,
			},
		})
		return result
	}
}

module.exports = DiscountService
