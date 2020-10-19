let baseCommand = require('../registry/structures/baseCommand')
module.exports = new baseCommand("say",[],(cmdName,argz,message) => {
	console.log(message.member.hasPermission("ADMINISTRATOR"))
	if(message.member.hasPermission("ADMINISTRATOR")) message.channel.send(argz.join(" "))
	else message.channel.send('lol noob,I only listen to admins')
	console.log(message.content)
})
