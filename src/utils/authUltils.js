'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = (payload, publicKey, privateKey) => {
	try {
		// accessToken
		const accessToken = JWT.sign(payload, publicKey, {
			algorithm: 'RS256',
			expiresIn: '2 days',
		})

		const refreshToken = JWT.sign(payload, privateKey, {
			algorithm: 'RS256',
			expiresIn: '7 days',
		})

		JWT.verify(accessToken, publicKey, (err, decoded) => {
			if (err) {
				console.log(err)
			} else {
				console.log(decoded)
			}
		})

		return { accessToken, refreshToken }
	} catch (error) {}
}

exports.module = createTokenPair
