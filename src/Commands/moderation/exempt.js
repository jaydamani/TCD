const baseCommand = require("../../registry/structures/baseCommand");
const obj = {
    unban : { name : 'Unban', perm : 'BAN_MEMBERS', a : 'ban', aPast : 'baned'},
    unmute : { name : 'Unmute', perm : 'MANAGE_ROLES', a : 'mute', aPast : 'muted'}
}
module.exports = new baseCommand('unmute',['unban'],(cmd,argz,message,client) => {
    
    let action = obj[cmd.toLowerCase()]
    let db = new require('better-sqlite3')('./modDB.db')
    let mod = message.member
    let [offenderID,...reason] = argz
    let guild = message.guild
    let dbObj = db.prepare(`select * from ${action.name}sTable where offenderID = ${offenderID} and status = 1`).get()

    offenderID = offenderID.match(/(?=<@!?)?([0-9]{15,})>?/)

    if(!offenderID) return message.channel.send('The given ID seems wrong.')
    offenderID = offenderID[1]

    if(!permArrays['can_' + action.a].includes(mod.roles.highest.id) && !mod.hasPermission(action.perm)) return message.channel.send("you don't have required perms")
    if(!dbObj) return message.channel.send(`The givem ID is wrong or the person wasn't ${action.aPast}`)    

})