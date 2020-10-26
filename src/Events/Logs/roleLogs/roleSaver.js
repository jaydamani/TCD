const baseEvent = require("../../../registry/structures/baseEvent");
let { logs : { memberUpdateChannelID } } = require('../../../../config/guild.json')

module.exports = new baseEvent('guildMemberUpdate',(oldMember,newMember,client) => {
    
    let guild = oldMember.guild
    
    if(oldMember.displayName != newMember.displayName) console.log(oldMember.displayName,",",newMember.displayName)
    
    let rolesRemoved = oldMember.roles.cache.filter(m => !newMember.roles.cache.has(m.id))
    let rolesAdded = newMember.roles.cache.filter(m => !oldMember.roles.cache.has(m.id))
    
    console.log(rolesAdded.keyArray(),rolesRemoved.keyArray(),696969)
    
    let db = client.db
    db.prepare('update roles set roleIDs = ?, position = ? where memberID = ?')
    .run(newMember.roles.cache.keyArray().join(),newMember.roles.highest.rawPosition,newMember.id)

})