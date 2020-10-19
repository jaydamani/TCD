let discord = require("discord.js")
let client = new discord.Client()
let bot = require("../config/bot")
let { registerEvents, registerFunctions, registerCommands } = require("./registry/registry")

client.commandMap = new Map();

(async() => {
	await registerCommands("./src/Commands",client)
	await registerEvents("./src/Events",client)
	console.time()
	//client.delay(["1m","1s"],"test")
	client.login(bot.token).catch(console.error)
})()
