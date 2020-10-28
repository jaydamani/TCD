const baseEvent = require("../../../registry/structures/baseEvent");

module.exports = new baseEvent('ready',() => {
    
    let guild = client.guilds.cache.get(`727853079029874740`)
    let members = guild.members.cache
    let db = client.db
    let rolesArray = db.prepare('select * from roles').all()
    let rolesMap = new Map()
    let newMembers = ''

    for(let roles of rolesArray) rolesMap.set(roles.memberID,roles.roleIDs.split(','))

    for (let member of members.values()){
        
        let roles = member.roles.cache.filter(r => !r.managed).keyArray()
        
        if(rolesMap.has(member.id)){

            let oldRoles = rolesMap.get(member.id)
            let rolesAdded = roles.filter(r => !oldRoles.includes(r))
            let rolesRemoved = oldRoles.filter(r => !roles.includes(r.id))
            
            if(!(rolesAdded && rolesRemoved)) continue
            else {

                db.prepare(`update roles set roleIDs = '${roles.join()}', position = ${member.roles.highest.rawPosition} where memberID = ${member.id}`).run()
            
            }
        
        }
        else {
            newMembers = newMembers.concat(`,('${member.id}','${roles.join()}',${member.roles.highest.rawPosition})`)
        }

    }
    
    if(newMembers) db.prepare(`insert into roles (memberID,roleIDs,position) values ${newMembers.substring(1)}`).run()

})