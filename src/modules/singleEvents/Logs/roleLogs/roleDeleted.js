const { MessageEmbed } = require("discord.js")
const BaseEvent = require("../../../../registry/structures/BaseEvent")
const { logs : { roleUpdateChannelID : logChannel }} = require('../../../../../config/guild.json')

module.exports = new BaseEvent('roleDelete',async (r) => {

    const db = r.client.db

    const { changes }  = db.prepare(`update roles set roleIDs = replace(roleIDs,${r.id},'') where roleIDs like ${r.id}`).run()    

    const a = await r.guild.fetchAuditLogs({ type : 32,limit : 1})
    const { executor } = a.entries.first()

    const embed = new MessageEmbed()
    .setTitle('Role Deleted')
    .setColor(r.hexColor)
    .addField('Name :',r.name,true)
    .addField('Color :',r.hexColor,true)
    .addField('Position :',r.rawPosition,true)
    .addField('ID :',r.id,true)
    .addField('No. of people with the role :',changes,true)
    .addField('Responsible Admin :',`${executor}`,true)
    .addField('AdminID',`${executor.id}`)
    .setTimestamp()

    r.guild.channels.cache.get(logChannel).send({ embed })

})
