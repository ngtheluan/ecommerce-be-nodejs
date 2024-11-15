'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

//authentication
router.use(authentication)
router.post('', asyncHandler(ProductController.createProduct))

module.exports = router
