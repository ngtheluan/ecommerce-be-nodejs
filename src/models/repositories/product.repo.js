'use strict'
const { product } = require('../product.model')
const { Types } = require('mongoose')

const queryProduct = async ({ query, limit, skip }) => {
	return await product
		.find(query)
		.populate('product_shop', 'name email -_id')
		.sort({ updatedAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
	return await queryProduct({
		query,
		limit,
		skip,
	})
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
	return await queryProduct({
		query,
		limit,
		skip,
	})
}

const publishProductByShop = async ({ product_shop, product_id }) => {
	const foundShop = product.findOne({
		_id: new Types.ObjectId(product_id),
		product_shop: new Types.ObjectId(product_shop),
	})

	if (!foundShop) return null
	const { modifiedCount } = await product.updateOne(
		{ _id: product_id },
		{ $set: { isDraft: false, isPublished: true } }
	)

	return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
	const foundShop = product.findOne({
		_id: new Types.ObjectId(product_id),
		product_shop: new Types.ObjectId(product_shop),
	})

	if (!foundShop) return null
	const { modifiedCount } = await product.updateOne(
		{ _id: product_id },
		{ $set: { isDraft: true, isPublished: false } }
	)

	return modifiedCount
}

const searchProductByUser = async ({ keysearch }) => {
	const regexSearch = new RegExp(keysearch)
	const results = await product
		.find(
			{
				isPublished: true,
				$text: { $search: regexSearch },
			},
			{ score: { $meta: 'textScore' } }
		)
		.sort({ score: { $meta: 'textScore' } })
		.lean()
	return results
}

module.exports = {
	findAllDraftsForShop,
	findAllPublishForShop,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
}
