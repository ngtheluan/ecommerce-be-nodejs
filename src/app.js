require('dotenv').config()
const compression = require('compression')
const express = require('express')

const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//init database
require('./database/init.mongodb')

// check overload
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

//check countConnect
// const { countConnect } = require('./helpers/check.connect')
// countConnect()

//init route
app.use('', require('./routers'))

module.exports = app
