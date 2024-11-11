'use strict'
const { uniq } = require('lodash')
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

// Declara the Schema of the Mongo model
const apiKeySchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			require: true,
			enum: ['0000', '1111', '2222'],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
)

module.exports = apiKeySchema
module.exports = model(DOCUMENT_NAME, apiKeySchema)
