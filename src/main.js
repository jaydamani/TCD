let discord = require("discord.js")
let client = new discord.Client()
let bot = require("../config/bot")
let { registerEvents, registerFunctions, registerCommands } = require("./registry/registry")

client.commandMap = new Map();

(async() => {

	await registerCommands("./src/Commands",client)
	await registerEvents("./src/Events",client)

	client.login(bot.token).catch(console.error)

})()
//asfkosfopiuweofiuweofiuweoifjcaweopj