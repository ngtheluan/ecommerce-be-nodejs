'use strict'
const bcrypt = require('bcrypt')
const shopModel = require('../models/shop.model')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER: 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccessService {
	static login = async ({ refreshToken = null, email, password }) => {
		//step 1: check email in dbs
		const foundShop = await findByEmail({ email })
		if (!foundShop) throw new BadRequestError('Shop not registered!')

		//step 2: match password
		const match = bcrypt.compare(password, foundShop.password)
		if (!match) throw new AuthFailError('Password incorrect!')

		//step 3: create access-token, refresh-token and save
		const privateKey = crypto.randomBytes(64).toString('hex') //sign-token
		const publicKey = crypto.randomBytes(64).toString('hex') //verify-token

		//step 4: genarate token
		const tokens = await createTokenPair(
			{
				userId: foundShop._id,
				email,
			},
			publicKey,
			privateKey
		)

		await KeyTokenService.createKeyToken({
			refreshToken: tokens.refreshToken,
			privateKey: privateKey,
			publicKey: publicKey,
		})
		return {
			shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
			tokens,
		}

		//step 5: get data and return login
	}

	static signUp = async ({ name, email, password }) => {
		try {
			// check email exist ?
			const holderShop = await shopModel.findOne({ email }).lean()
			if (holderShop) {
				throw new BadRequestError('BadRequestError')
			}

			// hash password for security
			const passwordHash = await bcrypt.hash(password, 10)
			const newShop = await shopModel.create({
				name,
				email,
				password: passwordHash,
				roles: [RoleShop.SHOP],
			})

			console.log('newShop', newShop)

			if (newShop) {
				/***** Advanced generate public and private key *****/
				const { privateKey_v1, publicKey_v1 } = crypto.generateKeyPairSync('rsa', {
					modulusLength: 4096,
					publicKeyEncoding: {
						type: 'pkcs1',
						format: 'pem',
					},
					privateKeyEncoding: {
						type: 'pkcs1', //pkcs1 : Public key CryptoGraphy Standards
						format: 'pem',
					},
				})

				/***** Basic: generate public and private key *****/
				const privateKey = crypto.randomBytes(64).toString('hex') //sign-token
				const publicKey = crypto.randomBytes(64).toString('hex') //verify-token

				console.log({ privateKey, publicKey }) // save collection KeyStore

				const keyStore = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
					privateKey,
				})

				if (!keyStore) {
					throw new BadRequestError('Create key token fail')
				}
				//created token pair
				const tokens = await createTokenPair(
					{
						userId: newShop._id,
						email,
					},
					publicKey,
					privateKey
				)

				console.log('Create token success :', tokens)

				return {
					code: 201,
					metadata: {
						shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
						tokens,
					},
				}
			}
			return {
				code: 200,
				metadata: null,
			}
		} catch (error) {
			throw new BadRequestError(error.message)
		}
	}
}

module.exports = AccessService
