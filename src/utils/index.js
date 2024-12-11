'use strict'
const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields)
}

// ['a','b'] -> {a: 1 ,b: 1}
const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((item) => [item, 1]))
}

// ['a','b'] -> {a: 0 ,b: 0}
const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map((item) => [item, 0]))
}

const removeUndefinedNullObject = (obj) => {
	Object.keys(obj).forEach((k) => {
		if (obj[k] === null) delete obj[k]
	})

	return obj
}

// { c : { d : 1 } } -> db.collections.updateOne({ `c.d` : 1 })
const updateNestedObject = (obj) => {
	const final = {}
	Object.keys(obj).forEach((k) => {
		if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
			const response = updateNestedObject(obj[k])
			Object.keys(response).forEach((key) => {
				final[`${k}.${key}`] = response[key]
			})
		} else {
			final[k] = obj[k]
		}
	})

	return final
}

const convertToObjectId = (id) => {
	return new Types.ObjectId(id)
}

module.exports = {
	getInfoData,
	getSelectData,
	getUnSelectData,
	removeUndefinedNullObject,
	updateNestedObject,
	convertToObjectId,
}
