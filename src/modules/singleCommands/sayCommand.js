const BaseCommand = require('../../registry/structures/BaseCommand')
module.exports = new BaseCommand("say",[],(cmdName,argz,message) => {

	if(message.member.hasPermission("ADMINISTRATOR")) message.channel.send(argz.join(" "))
	else message.channel.send('lol noob,I only listen to admins')

})
