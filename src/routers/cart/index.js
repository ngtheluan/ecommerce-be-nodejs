const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const CartController = require('../../controllers/cart.controller')
const { authenticationV2 } = require('../../auth/authUtils')

//authentication
router.use(authenticationV2)

router.post('', asyncHandler(CartController.addToCart))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.getListCart))
router.delete('', asyncHandler(CartController.deleteUserCartItem))

module.exports = router
