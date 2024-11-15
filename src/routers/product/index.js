'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const { authenticationV2 } = require('../../auth/authUtils')

//authentication
router.use(authenticationV2)
router.post('', asyncHandler(ProductController.createProduct))

module.exports = router
