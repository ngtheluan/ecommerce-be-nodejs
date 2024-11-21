'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const { authenticationV2 } = require('../../auth/authUtils')

router.get('/search/:keysearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.findAllProducts))
router.get('/:product_id', asyncHandler(ProductController.findProduct))

//authentication
router.use(authenticationV2)
router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:productId', asyncHandler(ProductController.updateProduct))
router.post('/published/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublished/:id', asyncHandler(ProductController.unPublishProductByShop))

//query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))

module.exports = router
