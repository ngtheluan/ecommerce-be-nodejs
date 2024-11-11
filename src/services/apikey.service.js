'use strict'

const findById = async (key) => {
	const objKey = await apiKeyModel.findById({ key, status: true }).lean()
	return objKey
}

module.exports = { findById }
