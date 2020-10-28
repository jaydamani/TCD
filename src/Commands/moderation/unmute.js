const baseCommand = require("../../registry/structures/baseCommand")
const { mod : modPerm  } = require('../../../config/guild.json')
const exempt = require("../../functions/moderation/exempt")
const actionsList = {
    unban : { name : 'Unban', a : 'ban', perm : 'BAN_MEMBERS'},
    unmute : { name : 'Unmute', a : 'mute', perm : 'MANAGE_ROLES'}
}

module.exports = new baseCommand('unmute',['unshut'],(cmd,argz,message) => {

    if(argz.length < 2) return message.channel.send('Not enough arguments.\n*proceeds to mute you*')

    let start = process.hrtime()
    let db = client.db
    let [dbObj,...reason] = argz
    let mod = message.member
    let guild = message.guild

    reason = reason.join(' ')
    dbObj = dbObj.match(/(?=<@!?)?[0-9]{15,}(?=>)?|[1-9][0-9]{1,15}/)

    if(!dbObj) return message.channel.send('The given ID seems wrong.')
    if(!reason) return message.channel.send('Please specify a reason') 
    dbObj = db.prepare(`select * from mutesTable where offenderID = '${dbObj[0]}' and status = 1 limit 1`).get()
    if(!dbObj) return message.channel.send('The given ID is wrong or the user is no longer muted')

    if(!modPerm['can_mute'].includes(mod.id) && !mod.hasPermission('MANAGE_ROLES')) return message.channel.send("you don't have required perms")

    guild.members.fetch(dbObj.offenderID).then(offender => {
        console.log(dbObj)
        if(offender.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
        exempt({ mod, offender, guild, reason, action : 'Unmute'},dbObj,db).then(() => {
            
            message.channel.send( `${offender} was umuted.`)
            console.log(process.hrtime(start))
        })
        
    }).catch(err => {
        
        if(err.message == 'Unknown User') message.channel.send(`The given ID seems wrong.`)
        else if(err.message == 'Unknown Member') client.users.fetch(offenderID).then(offender => {

            exempt({ mod, offender, guild, dbObj, reason, action : 'Unmute' },dbObj,db).then(() => {
                
                message.channel.send(`${offender.username}#${offender.discriminator} won't be muted if they rejoin.`)
                console.log(process.hrtime(start))
            })

        })
        else throw err

    })

})