const baseCommand = require("../../registry/structures/baseCommand")
const { mod : modPerm  } = config
const exempt = require("../../functions/moderation/exempt")
const actionsList = {
    unban : { name : 'Unban', a : 'ban', perm : 'BAN_MEMBERS'},
    unmute : { name : 'Unmute', a : 'mute', perm : 'MANAGE_ROLES'}
}

module.exports = new baseCommand('unmute',['unshut'],async (cmd,argz,message) => {

    if(argz.length < 2) return message.channel.send('Not enough arguments.\n*proceeds to mute you*')

    let start = process.hrtime()
    let db = client.db
    let [dbObj,...reason] = argz
    let mod = message.member
    let guild = message.guild
    let offender

    reason = reason.join(' ')
    dbObj = dbObj.match(/(?=<@!?)?[0-9]{15,}(?=>)?|[1-9][0-9]{1,15}/)

    if(!dbObj) return message.channel.send('The given ID seems wrong.')
    if(!reason) return message.channel.send('Please specify a reason') 
    dbObj = db.prepare(`select * from modsTable where offenderID = '${dbObj[0]}' and status = 1 and action = 'mute' limit 1`).get()
    if(!dbObj) return message.channel.send('The given ID is wrong or the user is no longer muted')

    if(!modPerm['can_mute'].includes(mod.id) && !mod.hasPermission('MANAGE_ROLES')) return message.channel.send("you don't have required perms")

    try {

        offender = guild.members.cache.has(dbObj.offenderID) ?
        guild.members.cache.get(dbObj.offenderID) : await client.users.fetch(dbObj.offenderID)

    } catch (err) {

        if(err.message == 'Unknown User') return message.channel.send(`Can not find the user.`)
        else throw err

    }

    if(offender?.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
    await exempt({ mod, offender, guild, reason, action : 'Unmute'},dbObj,db)
    message.channel.send( `${offender} was umuted.`)

})