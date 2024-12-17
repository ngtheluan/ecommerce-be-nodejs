const { SuccessResponse } = require('../core/success.respone')
const CheckOutService = require('../services/checkout.service')

class CheckoutController {
	checkout = async (req, res, next) => {
		new SuccessResponse({
			message: 'Checkout product !',
			metadata: await CheckOutService.checkOutReview(req.body),
		}).send(res)
		next()
	}
}

module.exports = new CheckoutController()
