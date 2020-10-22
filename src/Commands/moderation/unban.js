const baseCommand = require("../../registry/baseCommand")
const { mod : { can_ban } } = require('../../../config/guild.json')

module.exports = new baseCommand('unmute',['unshut'],(cmd,argz,message,client) => {

    if(argz.length < 2) return message.channel.send('Not enough arguments.\n*proceeds to mute you*')
    
    let [offenderID,...reason] = argz
    let mod = message.member
    let guild = message.guild

    reason = reason.join(' ')

    offenderID = offenderID.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offenderID) return message.channel.send('The given ID seems wrong.')
    if(!reason) return message.channel.send('Please specify a reason') 
    offenderID = offenderID[1]

    
    if(!canMute.includes(mod.id) && !mod.hasPermission('manage_roles')) return message.channel.send("you don't have required perms")

    guild.members.fetch(offenderID).then(offender => {

        if(offender.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
        client.unmute({ mod, offender, guild, reason })
        message.channel.send(`${offender} was unmuted`)

    }).catch(err => {

        if(err.message == 'Unknown User') message.channel.send(`The given ID seems wrong`)
        else if(err.message == 'Unknown Member') client.users.fetch(offenderID).then(offender => {
            
            message.channel.send(client.mute({ mod, offender, guild, time, reason }) || `${offender.username}#${offender.discriminator} is not in guild so they will be muted when they join`)
            
        })
        else throw err

    })

})