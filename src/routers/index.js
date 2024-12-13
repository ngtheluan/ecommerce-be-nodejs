'use strict'
const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')

router.use(apiKey) //check apiKey
router.use(permission('0000')) //check permissions

router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))

module.exports = router
