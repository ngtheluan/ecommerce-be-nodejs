'use strict'
const keyTokenModel = require('../models/keytoken.model')
const { convertToObjectId } = require('../utils/index')

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

	static findByUserId = async (userId) => {
		return await keyTokenModel.findOne({ user: userId })
	}

	static removeKeyById = async (id) => {
		return await keyTokenModel.deleteOne(id)
	}

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
	}

	static findByRefreshToken = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshToken })
	}

	static deleteKeyById = async (userId) => {
		return await keyTokenModel.findOneAndDelete({ user: convertToObjectId(userId) })
	}
}

module.exports = KeyTokenService
