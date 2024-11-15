'use strict'
const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')

router.use(apiKey) //check apiKey
router.use(permission('0000')) //check permissions

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

module.exports = router
