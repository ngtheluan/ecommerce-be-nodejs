const { SuccessResponse } = require('../core/success.respone')
const ProductService = require('../services/product.service')

class ProductController {
	createProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create Product OK !',
			metadata: await ProductService.createProduct(req.body.product_type, req.body),
		}).send(res)
	}
}

module.exports = new ProductController()
