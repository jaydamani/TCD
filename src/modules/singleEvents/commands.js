const baseEvent = require("../../registry/structures/baseEvent")
const prefix = "-"

module.exports = new baseEvent('message',(message) => {

	if(!message.member) return
	if(!message.content.startsWith(prefix)) return
	if(message.author.bot) return
	
	const [command,...argz] = message.content.slice(prefix.length).trim().split(/\s+/)
	
	if(message.client.commandMap.has(command)){
		
		try {

			const a = message.client.commandMap.get(command)
			a.code = (command,argz,message,a.obj)
		
		} catch (err) {

			message.channel.send(`There was some unknown error but don't worry the dev has been informed`)
			
			message.client.users.cache.get(`429606655320391680`)
			.send(`channel : <#${message.channel.id}>\nmessage : ${message.url}\nerror : ${err}`)

		}
		
	}
})