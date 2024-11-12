'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const accessController = require('../../controllers/access.controller')

router.post('/shop/login', asyncHandler(accessController.login))
router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router
