// const { checkOverload } = require('./helpers/check.connect')
// const { countConnect } = require('./helpers/check.connect')

require('dotenv').config()
require('./database/init.mongodb') //init database

const compression = require('compression')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const express = require('express')
const app = express()

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('', require('./routers')) //init route

//checkOverload()
//countConnect()
module.exports = app
