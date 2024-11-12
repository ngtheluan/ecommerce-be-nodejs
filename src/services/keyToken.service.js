'use strict'
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
	static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
		try {
			/********** level beginer **********/
			// const tokens = await keyTokenModel.create({
			// 	user: userId,
			// 	publicKey,
			// 	privateKey,
			// })
			// return tokens ? tokens.publicKey : null

			/********** level advance **********/
			const filter = { user: userId }
			const update = { publicKey, privateKey, refreshToken, refreshTokensUsed: [] }
			const option = { upsert: true, new: true } //if not exist will create else update

			const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option)
			return tokens ? tokens.publicKey : null
		} catch (error) {
			return error
		}
	}
}

module.exports = KeyTokenService
