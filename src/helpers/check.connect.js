'use strict'
const moongose = require('mongoose')

// count connect
const countConnect = () => {
	const numConnection = moongose.connections.length
	console.log(`numConnection: ${numConnection}`)
}

// check overload
const _SECONDS = 5000
const os = require('os')
const process = require('process')

const checkOverload = () => {
	setInterval(() => {
		const numConnection = moongose.connections.length
		const numCore = os.cpus().length
		const memoryUsage = process.memoryUsage().rss

		// Example maximum number of connections based on number of cores
		const maxConnection = numCore * 5

		console.log(`Active Connections: ${numConnection}`)
		console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`)

		if (numConnection > maxConnection) {
			console.log(`Connection overload detected !`)
		}
	}, _SECONDS)
}

module.exports = { countConnect, checkOverload }
