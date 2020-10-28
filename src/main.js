let discord = require("discord.js")
global.client = new discord.Client({ fetchAllMembers : true, allowedMentions : { parse : ['users'] }})
let bot = require("../config/bot")
let { registerEvents, registerFunctions, registerCommands } = require("./registry/registry")

client.commandMap = new Map()
client.db = new require('better-sqlite3')('./ModDB.db');

(async() => {

	await registerCommands("./src/Commands" )
	await registerEvents("./src/Events")

	client.login(bot.token).catch(console.error)

})()