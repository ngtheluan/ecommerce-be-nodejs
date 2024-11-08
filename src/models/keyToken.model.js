'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'Keys'

// Declara the Schema of the Mongo model
const keyTokenSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Shop',
		},
		publicKey: {
			type: String,
			required: true,
		},
		privateKey: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
)

module.exports = keyTokenSchema
module.exports = model(DOCUMENT_NAME, keyTokenSchema)
