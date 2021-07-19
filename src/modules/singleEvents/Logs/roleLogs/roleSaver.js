const BaseEvent = require("../../../../registry/structures/BaseEvent");
let { logs : { memberUpdateChannelID } } = require('../../../../../config/guild.json')
const { MessageEmbed } = require('discord.js')
module.exports = new BaseEvent('guildMemberUpdate',(oldMember,newMember) => {

    memberUpdateChannelID = oldMember.guild.roles.resolve(memberUpdateChannelID)
    const guild = oldMember.guild    
    const rolesRemoved = oldMember.roles.cache.filter(m => !newMember.roles.cache.has(m.id))
    const rolesAdded = newMember.roles.cache.filter(m => !oldMember.roles.cache.has(m.id))
    const db = newMember.client.db
    const query = db.prepare('update roles set roleIDs = ? where memberID = ?')
    const embed = new MessageEmbed({ title : `Roles updated for $(newMember)` })

    if(rolesRemoved.size){

    	query.run(newMember.roles.cache.keyArray().join(), newMember.id)

	    memberUpdateChannelID.send({ embed : embed.addField('Roles removed :', rolesRemoved.valuesArray.join())})

    }
    if(rolesAdded.size){

	    query.run(newMember.roles.cache.keyArray().join(), newMember.id)

	    memberUpdateChannelID.send({ embed : embed.addField('Roles added :', rolesRemoved.valuesArray.join())})

    }

})
