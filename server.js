const app = require('./src/app')

const PORT = process.env.PRO_APP_PORT

const server = app.listen(PORT, () => {
	console.log(`ecommerce start with port : ${PORT}`)
})

//When press Control + C
process.on('SIGINT', () => {
	server.close(() => console.log(` Exit Server Express!`))
})
