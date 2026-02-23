'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
	API_KEY: 'x-api-key',
	CLIENT_ID: 'x-client-id',
	AUTHORIZATION: 'Authorization',
	REFRESH_TOKEN: 'x-rtoken-id', //with authenticationV2
}

const createTokenPair = async (payload, publicKey, privateKey) => {
	try {
		const accessToken = JWT.sign(payload, publicKey, {
			expiresIn: '2 days',
		})

		const refreshToken = JWT.sign(payload, privateKey, {
			expiresIn: '7 days',
		})

		JWT.verify(accessToken, publicKey, (err, decoded) => {
			if (err) {
				console.log('err verify::', err)
			} else {
				console.log('decoded verify::', decoded)
			}
		})

		return { accessToken, refreshToken }
	} catch (error) {}
}

const authentication = asyncHandler(async (req, res, next) => {
	//step 1 : check userId missing
	const userId = req.headers[HEADER.CLIENT_ID]
	if (!userId) throw new AuthFailError('Invalid Request')

	//step 2 : get access-token
	const keyStore = await findByUserId(userId)
	if (!keyStore) throw new NotFoundError('Not found keyStore')

	//step 3 : verify access-token
	const accessToken = req.headers[HEADER.AUTHORIZATION]
	if (!accessToken) throw new NotFoundError('Invalid Request')

	//step 4 : check user in dbs, keyStore with this userId?
	try {
		const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
		if (userId !== decodeUser.userId) throw new AuthFailError('Invalid UserId')
		req.keyStore = keyStore
		return next()
	} catch (error) {
		console.log(error)
		throw error
	}
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
	//step 1 : check userId missing
	const userId = req.headers[HEADER.CLIENT_ID]
	if (!userId) throw new AuthFailError('Invalid Request')

	//step 2 : get access-token
	const keyStore = await findByUserId(userId)
	if (!keyStore) throw new NotFoundError('Not found keyStore')

	//step 3 : verify access-token
	const refreshToken = req.headers[HEADER.REFRESH_TOKEN]

	if (refreshToken) {
		try {
			const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
			if (userId !== decodeUser.userId) throw new AuthFailError('Invalid UserId')
			req.keyStore = keyStore
			req.user = decodeUser
			req.refreshToken = refreshToken
			return next()
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	const accessToken = req.headers[HEADER.AUTHORIZATION]
	if (!accessToken) throw new NotFoundError('Invalid Request')

	//step 4 : check user in dbs, keyStore with this userId?
	try {
		const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
		if (userId !== decodeUser.userId) throw new AuthFailError('Invalid UserId')
		req.keyStore = keyStore
		return next()
	} catch (error) {
		console.log(error)
		throw error
	}
})

const verifyJWT = async (token, keySecret) => {
	return await JWT.verify(token, keySecret)
}

module.exports = {
	HEADER,
	createTokenPair,
	authentication,
	authenticationV2,
	verifyJWT,
}
