const { SuccessResponse } = require('../core/success.respone')
const ProductServiceV2 = require('../services/product.service.xxx')

class ProductController {
	createProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create Product OK !',
			metadata: await ProductServiceV2.createProduct(req.body.product_type, {
				...req.body,
				product_shop: req.user.userId,
			}),
		}).send(res)
	}
}

module.exports = new ProductController()
