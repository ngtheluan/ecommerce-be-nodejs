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
		next()
	}

	/**
	 * @desc Get All Drafts For Shop
	 * @param {Number} limit
	 * @param {Number} skip
	 * @return {JSON}
	 */
	getAllDraftsForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get List Drafts Success !',
			metadata: await ProductServiceV2.findAllDraftsForShop({
				product_shop: req.user.userId,
			}),
		}).send(res)
		next()
	}

	getAllPublishForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get List Publish Success !',
			metadata: await ProductServiceV2.findAllPublishForShop({
				product_shop: req.user.userId,
			}),
		}).send(res)
		next()
	}

	publishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Publish Product Success !',
			metadata: await ProductServiceV2.publishProductByShop({
				product_id: req.params.id,
				product_shop: req.user.userId,
			}),
		}).send(res)
		next()
	}

	unPublishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'UnPublish Product Success !',
			metadata: await ProductServiceV2.unPublishProductByShop({
				product_id: req.params.id,
				product_shop: req.user.userId,
			}),
		}).send(res)
		next()
	}

	getListSearchProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Search Product Success !',
			metadata: await ProductServiceV2.getListSearchProduct(req.params),
		}).send(res)
		next()
	}
}

module.exports = new ProductController()
