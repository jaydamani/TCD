const baseCommand = require("../../registry/structures/baseCommand");
const { mod : permArrays } = require('../../../config/guild.json')
const moderate = require('../../functions/moderation/moderate')
const timeConvertor = require("../../functions/timeConvertor");
const obj = {

    warn : { perm : 8, past : 'warned', name : 'warn'},
    mute : { perm : 'MANAGE_ROLES', past : 'muted', name: 'mute'},
    kick : { perm : 'KICK_MEMBERS', past : 'kicked', name: 'kick'},
    ban : { perm : 'BAN_MEMBERS', past : 'baned', name: 'ban'},

}

obj.shut = obj.mute
obj.yeet = obj.ban

module.exports = new baseCommand('warn',Object.keys(obj),(cmd,argz,message,client) => {
    
    if(argz.length < 2) return message.channel.send('not enough argz')

    let action = obj[cmd.toLowerCase()]
    let [offenderID,...reason] = argz
    let time
    let t = ''
    let mod = message.member
    let guild = message.guild
    let db = new require('better-sqlite3')('./ModDB.db')

    offenderID = offenderID.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offenderID) return message.channel.send('The given ID seems wrong.')
    offenderID = offenderID[1]

    if(!permArrays['can_' + action.name].includes(mod.roles.highest.id) && !mod.hasPermission(action.perm)) return message.channel.send("you don't have required perms")


    switch (action.name) {
        case 'mute' :
        case 'ban' :
        
        let status = db.prepare(`select status from ${action.name}sTable where offenderID = ${offenderID} and status = 1 `).get()
        if(status) return message.channel.send(`The user has already been ${action.past}`)

        time = reason[0].match(/[0-9]+[s,m,h,d,w,M,y]/g)
        console.log(time)
        if(time){

                reason.shift()
                let a = timeConvertor(time)
                t = ' for' + a.timeString
                time = a.timeInMS
                
        }
        break
    }

    reason = reason.join(' ')
    if(!reason) return message.channel.send('Please specify a reason') 

    guild.members.fetch(offenderID).then(offender => {

        if(offender.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
        moderate({ mod, offender, guild, time, reason, action },db).then(() => {
            
            message.channel.send( `${offender} was ${action.past}${t}.`)

        })
        

    }).catch(err => {
        
        if(err.message == 'Unknown User') message.channel.send(`The given ID seems wrong.`)
        else if(err.message == 'Unknown Member') client.users.fetch(offenderID).then(offender => {

            if(action.name == 'kick') return message.channel.send(`I can't seem to kick people outside of this server like the guy you mentioned. Any idea why?`)
            moderate({ mod, offender, guild, time, reason, action }).then(() => {
                
                message.channel.send(`${offender.username}#${offender.discriminator} was ${action.past} even though he wasn't in the guild${t}.`)

            })

        })
        else throw err

    })

})