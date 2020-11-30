const baseCommand = require("../../registry/structures/baseCommand");
const { mod : permArrays } = config
const moderate = require('../../functions/moderation/moderate')
const { time2MS, MS2String} = require("../../functions/timeFunctions");
const obj = {

    warn : { perm : 8, name : 'warn'},
    mute : { perm : 'MANAGE_ROLES', name: 'mute'},
    kick : { perm : 'KICK_MEMBERS', name: 'kick'},
    ban : { perm : 'BAN_MEMBERS', name: 'ban'},

}

obj.shut = obj.mute
obj.yeet = obj.ban

module.exports = new baseCommand('warn',Object.keys(obj),async (cmd,argz,message) => {

    if(argz.length < 2) return message.channel.send('not enough argz')

    let action = obj[cmd.toLowerCase()]
    let [offender,...reason] = argz
    let time
    let mod = message.member
    let guild = message.guild
    let db = client.db

    offender = offender.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offender) return message.channel.send('The given ID seems wrong.')
    offender = offender[1]

    if(!permArrays['can_' + action.name].find(r => mod.roles.cache.keyArray().includes(r)) && !mod.hasPermission(action.perm)) return message.channel.send("you don't have required perms")

    reason = reason?.join()

    switch (action.name) {

        case 'mute' :

            action.past = 'muted'
        
        case 'ban' :
            
            let status = db.prepare(`select status from ${action.name}sTable where offenderID = ${offender} and status = 1 `).get()
            if(status) return message.channel.send(`The user has already been ${action.past ?? action.name}`)

            [reason,time] = reason?.split(/^((?:[0-9]+[s,m,h,d,M,y](?: |,|))+)/).reverse()
            
            if(time){

                    let ms = time2MS(time)
                    time.obj = new Date(Date.now() + ms)
                    time.string = MS2String(ms)
                    
            }
            break
    
    }

    if(!reason) return message.channel.send('Please specify a reason') 

    try {

        offender = guild.members.cache.has(offender) ?
        guild.members.cache.get(offender) : await client.users.fetch(offender)

    } catch (err) {
        
        if(err.message == 'Unknown User') return message.channel.send(`Can not find the user.`)
        else throw err

    }

    if(offender?.roles.highest.comparePositionTo(mod.roles.highest) > 0) return message.channel.send('The offender is above mod')
    await moderate({ mod, offender, guild, time, reason, action : action.name },db)
    message.channel.send( `${offender} was ${action.past ?? action.name + 'ed'}${time.string ? ' for' + time.string : ''}.`)

})