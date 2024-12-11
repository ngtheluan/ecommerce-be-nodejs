const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const DiscountController = require('../../controllers/discount.controller')
const { authenticationV2 } = require('../../auth/authUtils')

router.get('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProducts))

//authentication
router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeByShop))

module.exports = router
