'use strict'
const { getUnSelectData, getSelectData } = require('../../utils')

const findAllDiscountCodesUnUsed = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	unselect,
	model,
}) => {
	const skip = (page - 1) * limit
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
	const products = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getUnSelectData(unselect))
		.lean()

	return products
}

const findAllDiscountCodesSelect = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	select,
	model,
}) => {
	const skip = (page - 1) * limit
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
	const products = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean()

	return products
}

const checkDiscountExists = async ({ model, filter }) => {
	const foundDiscount = model.findOne(filter).lean()
	return foundDiscount
}

module.exports = {
	findAllDiscountCodesUnUsed,
	findAllDiscountCodesSelect,
	checkDiscountExists,
}
