const discord = require("discord.js")
global.client = new discord.Client({ 
	fetchAllMembers : true, allowedMentions : { parse : ['users'] },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
})
global.config = require('../config/guild.json')
const bot = require("../config/bot")
const register = require("./registry/registry")

client.commandMap = new Map()
const db = new require('better-sqlite3')('./modDB.db');
db.function('get',(a,b,c) => client[a].get(b)[c]);

register('./src/modules',client,db).then(() => client.login(bot.token))
