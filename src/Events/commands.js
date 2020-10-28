let baseEvent = require("../registry/structures/baseEvent")
let prefix = "-"

module.exports = new baseEvent('message',(message) => {

	if(!message.member) return
	if(!message.content.startsWith(prefix)) return
	if(message.author.bot) return
	
	let [command,...argz] = message.content.slice(prefix.length).trim().split(" ")
	console.log(command,argz.commandMap,10)
	
	if(client.commandMap.has(command)){
		
		try {

			client.commandMap.get(command)(command,argz,message)
		
		} catch (err) {

			console.error(err)

			message.channel.send(`There was some unknown error but don't worry the dev has been informed`)
			
			client.users.cache.get(`429606655320391680`)
			.send(`channel : <#${message.channel.id}>\nmessage : ${message.url}\nerror : ${err}`)
		
		}
		
	}
})
