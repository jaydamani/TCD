const baseCommand = require("../../registry/baseCommand")
const { mod : { can_mute, muteRoleID } } = require('../../../config/guild.json')
const exempt = require("../../functions/moderation/exempt")
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

    
    if(!can_ban.includes(mod.id) && !mod.hasPermission('manage_roles')) return message.channel.send("you don't have required perms")

    guild.members.fetchBan(offenderID).then(ban => {

        exempt({ mod, offender : ban.user, reason, action : 'Unban' })        

    })

})
