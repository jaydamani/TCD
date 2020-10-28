const baseCommand = require('../../registry/structures/baseCommand')
const { mod : { canWarn }} = config
const { MessageEmbed } = require('discord.js')

module.exports = new baseCommand('clearWarn',['unwarn'],(cmd,argz,message) => {
    
    let guild = message.guild
    let mod = message.member
    let db = client.db
    let warn = db.prepare('select * from warnsTable where warnID = ? and status = 1').get(warn)   
    let reason = argz.join(" ")

    if(!canWarn.includes(mod.id) && !mod.hasPermission(8)) return message.channel.send(`you don't have enough perms`)

    if(!reason) return message.channel.send('You must provide a reason')

    if(!warn) return message.channel.send('the given id is wrong or the warn is already cleared')

    offender = client.users.fetch(warn.offenderID)
    
    db.prepare('begin').run()

    let { changes } = db.prepare(`update warnsTable set status = 0,reasonToClear = ?,unwarningModID = ${mod.id} where warnID = ${warn.warnID} limit 1`).run(reason)
    
    if(changes != 1){
    
        db.prepare('rollback').run()
        return message.channel.send('The given ID seems incorrect')
    
    }else{
    
        db.prepare('end').run()
        message.channel.send(`${offender.username}#${offender.discriminator}(${offender.id}) was unwarned`)
    
    }
    
    
})