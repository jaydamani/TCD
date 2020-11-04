const discord = require("discord.js")
global.client = new discord.Client({ 
	fetchAllMembers : true, allowedMentions : { parse : ['users'] },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
})
global.config = require('../config/guild.json')
const bot = require("../config/bot")
const { registerEvents, registerCommands } = require("./registry/registry")

client.commandMap = new Map()
client.db = new require('better-sqlite3')('./ModDB.db');

(async() => {

	await registerCommands("./src/Commands" )
	await registerEvents("./src/Events")

	client.login(bot.token).catch(console.error)

})()
