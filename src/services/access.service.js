'use strict'
const bcrypt = require('bcrypt')
const shopModel = require('../models/shop.model')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const createTokenPair = require('../auth/authUtils')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER: 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccessService {
	static signUp = async ({ name, email, password }) => {
		try {
			// check email exist ?
			const holderShop = await shopModel.findOne({ email }).lean()
			if (holderShop) {
				return {
					code: 'xxxx',
					message: 'Shop already registered',
				}
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
				const {
					privateKey, //private key to sign-token
					publicKey, //public key to verify-token
				} = crypto.generateKeyPairSync('rsa', {
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

				console.log({ privateKey, publicKey }) // save collection KeyStore

				const publicKeyString = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
				})

				if (!publicKeyString) {
					return {
						code: 'xxxx',
						message: 'Create key token fail',
						status: 'error',
					}
				}

				const publicKeyObject = crypto.createPublicKey(publicKeyString)
				console.log('publicKeyObject ::', publicKeyObject)

				//created token pair
				const tokens = await createTokenPair(
					{
						userId: newShop._id,
						email,
					},
					publicKeyString,
					privateKey
				)
				console.log('token ::', tokens)

				return {
					code: 201,
					metadata: {
						shop: newShop,
						tokens,
					},
				}
			}
			return {
				code: 200,
				metadata: null,
			}
		} catch (error) {
			return {
				code: '',
				message: '',
				status: 'error',
			}
		}
	}
}

module.exports = AccessService
