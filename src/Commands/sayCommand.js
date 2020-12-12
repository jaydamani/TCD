const baseCommand = require('../registry/structures/baseCommand')
module.exports = new baseCommand("say",[],(cmdName,argz,message) => {

	if(message.member.hasPermission("ADMINISTRATOR")) message.channel.send(argz.join(" "))
	else message.channel.send('lol noob,I only listen to admins')

})
