const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.respone')

class DiscountController {
	createDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successful Code Generations !',
			metadata: await DiscountService.createDiscount({
				...req.body,
				shopId: req.user.userId,
			}),
		}).send(res)
		next()
	}

	getAllDiscountCodeByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successful Code Found !',
			metadata: await DiscountService.getAllDiscountCodeByShop({
				...req.query,
				shopId: req.user.userId,
			}),
		}).send(res)
		next()
	}

	getDiscountAmount = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successful Code Found !',
			metadata: await DiscountService.getDiscountAmount({
				...req.body,
			}),
		}).send(res)
		next()
	}

	getAllDiscountCodeWithProducts = async (req, res, next) => {
		new SuccessResponse({
			message: 'Successful Code Found !',
			metadata: await DiscountService.getAllDiscountCodeWithProducts({
				...req.query,
			}),
		}).send(res)
		next()
	}

	deleteDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Delete Discount Success !',
			metadata: await DiscountService.deleteDiscountCode({
				codeId: req.params.codeId,
				shopId: req.user.userId,
			}),
		}).send(res)
		next()
	}

	cancelDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Cancel Discount Success !',
			metadata: await DiscountService.cancelDiscountCode({
				codeId: req.params.codeId,
				userId: req.user.userId,
				shopId: req.user.userId,
			}),
		}).send(res)
		next()
	}
}

module.exports = new DiscountController()
