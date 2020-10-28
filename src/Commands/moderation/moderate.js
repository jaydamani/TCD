const baseCommand = require("../../registry/structures/baseCommand");
const { mod : permArrays } = require('../../../config/guild.json')
const moderate = require('../../functions/moderation/moderate')
const timeConvertor = require("../../functions/timeConvertor");
const obj = {

    warn : { perm : 8, name : 'warn', past : 'warned'},
    mute : { perm : 'MANAGE_ROLES', name: 'mute', past : 'muted'},
    kick : { perm : 'KICK_MEMBERS', name: 'kick', past : 'kicked'},
    ban : { perm : 'BAN_MEMBERS', name: 'ban', past : 'baned'},

}

obj.shut = obj.mute
obj.yeet = obj.ban

module.exports = new baseCommand('warn',Object.keys(obj),(cmd,argz,message) => {
    console.time()
    if(argz.length < 2) return message.channel.send('not enough argz')

    let action = obj[cmd.toLowerCase()]
    let [offenderID,...reason] = argz
    let time = { string : '', obj : null}
    let mod = message.member
    let guild = message.guild
    let db = client.db

    offenderID = offenderID.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offenderID) return message.channel.send('The given ID seems wrong.')
    offenderID = offenderID[1]

    if(!permArrays['can_' + action.name].includes(mod.roles.highest.id) && !mod.hasPermission(action.perm)) return message.channel.send("you don't have required perms")

    switch (action.name) {
        case 'mute' :
            action.past = 'muted'
        case 'ban' :
        
        let status = db.prepare(`select status from ${action.name}sTable where offenderID = ${offenderID} and status = 1 `).get()
        if(status) return message.channel.send(`The user has already been ${action.past}`)

        time.obj = reason[0].match(/([0-9]+[s,m,h,d,w,M,y],?)+/)
        if(time.obj){

                reason.shift()
                time.obj = time.obj[0].match(/[0-9]+[s,m,h,d,w,M,y]/g)
                time = timeConvertor(time.obj)
                
        }
        break
    }

    reason = reason.join(' ')
    if(!reason) return message.channel.send('Please specify a reason') 

    guild.members.fetch(offenderID).then(offender => {

        if(offender.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
        moderate({ mod, offender, guild, time, reason, action : action.name },db).then(() => {
            
            message.channel.send( `${offender} was ${action.past || action.name + 'ed'}${time.string ? ' for' + time.string : ''}.`)
            console.timeEnd()
        })
        
    }).catch(err => {
        
        if(err.message == 'Unknown User') message.channel.send(`The given ID seems wrong.`)
        else if(err.message == 'Unknown Member') client.users.fetch(offenderID).then(offender => {

            if(action.name == 'kick') return message.channel.send(`I can't seem to kick people outside of this server like the guy you mentioned. Any idea why?`)
            moderate({ mod, offender, guild, time, reason, action : action.name }).then(() => {
                
                message.channel.send(`${offender.username}#${offender.discriminator} was ${action.past || action.name + 'ed'}${time.string ? ' for' + time.string : ''} even though he wasn't in the guild${time.string ? time.string : ''}.`)
                console.timeEnd()
            })

        })
        else throw err

    })

})