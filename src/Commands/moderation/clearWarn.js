const baseCommand = require('../../registry/structures/baseCommand')
const exempt = require('../../functions/moderation/exempt')
const { mod : { canWarn }} = config

module.exports = new baseCommand('clearWarn',['unwarn'],async (cmd,argz,message) => {
    
    let guild = message.guild
    let mod = message.member
    let db = client.db
    let warn = db.prepare('select * from warnsTable where warnID = ? and status = 1').get(warn)   
    let reason = argz.join(" ")

    if(!canWarn.includes(mod.id) && !mod.hasPermission(8)) return message.channel.send(`you don't have enough perms`)

    if(!reason) return message.channel.send('You must provide a reason')

    if(!warn) return message.channel.send('the given id is wrong or the warn is already cleared')
    
    try {

        let offender = guild.members.cache.has(warn.offenderID) ?
        guild.members.cache.get(warn.offenderID) : await client.users.fetch(offenderID)

    } catch (err) {
        
        if(err.message == 'Unknown User') return message.channel.send(`can not find the user`)
        else throw err
    
    }

    await exempt({ mod: message.member, offender, reason, action : 'unwarn', guild},warn)
    message.channel.send(`${offender.displayName} was unwarned`)

})