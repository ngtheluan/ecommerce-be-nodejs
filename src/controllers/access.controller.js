'use strict'

const AccessService = require('../services/access.service')

class AccessController {
	signUp = async (req, res, next) => {
		try {
			console.log('[P]::signUp::', req.body)
			return res.status(201).json(await AccessService.signUp(req.body))
		} catch (error) {
			res.status(400).json({ error: error.message })
		}
	}
}

module.exports = new AccessController()
