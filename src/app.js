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

//init route
app.use('', require('./routers'))

//handle error
app.use((req, res, next) => {
	const error = new Error('Not Found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	const statusCode = error.status || 500
	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		message: error.message || 'Internal Server Error',
	})
})

//checkOverload()
//countConnect()
module.exports = app
