const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const CheckOutController = require('../../controllers/checkout.controller')

//authentication
router.use(authenticationV2)
router.post('/review', asyncHandler(CheckOutController.checkout))

module.exports = router
