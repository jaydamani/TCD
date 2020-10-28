const baseCommand = require("../../registry/structures/baseCommand")
const { mod : { can_ban } } = config
const exempt = require("../../functions/moderation/exempt")
module.exports = new baseCommand('unban',[],(cmd,argz,message) => {

    if(argz.length < 2) return message.channel.send('Not enough arguments.\n*proceeds to mute you*')
    
    let [offenderID,...reason] = argz
    let mod = message.member
    let guild = message.guild

    reason = reason.join(' ')

    offenderID = offenderID.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offenderID) return message.channel.send('The given ID seems wrong.')
    if(!reason) return message.channel.send('Please specify a reason') 
    offenderID = offenderID[1]

    
    if(!can_ban.includes(mod.id) && !mod.hasPermission('manage_roles')) return message.channel.send("you don't have required perms")

    guild.fetchBan(offenderID).then(ban => {

        exempt({ mod, offender : ban.user, reason, guild, action : 'Unban' }).then(() => {
            
            message.channel.send(`${ban.user.username}#${ban.user.discriminator} was unbanned.`)

        })

    }).catch(err => {
        
        if(err.message == 'Unknown User') message.channel.send('The given ID seems wrong')
        else if(err.message == 'Unknown Ban') message.channel.send('The given user was never banned')
        
    })

})
