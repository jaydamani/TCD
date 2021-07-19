const BaseEvent = require("../../../../registry/structures/BaseEvent");
const config = require('../../../../../config/guild.json')
module.exports = new BaseEvent('ready',({ db, client }) => {

    const guild = client.guilds.cache.get(config.id)
    const members = guild.members.cache
    const rolesArray = db.prepare('select * from roles').all()
    const rolesMap = new Map()
    const newMembers = []

    rolesArray.forEach(roles => rolesMap.set(roles.memberID,roles.roleIDs.split(',')))

    for (const member of members.values()){

        const roles = member.roles.cache.filter(r => !r.managed).keyArray()

        if(rolesMap.has(member.id)){

            const oldRoles = rolesMap.get(member.id)
            const rolesAdded = roles.filter(r => !oldRoles.includes(r))
            const rolesRemoved = oldRoles.filter(r => !roles.includes(r.id))

            if(rolesAdded.length || rolesRemoved.length){

                db.prepare(`update roles set roleIDs = '${roles.join()}', position = ${member.roles.highest.rawPosition} where memberID = ${member.id}`).run()

            }

        }
        else newMembers.push(`('${member.id}','${roles.join()}')`)

    }
    
    if(newMembers.length) db.prepare(`insert into roles (memberID,roleIDs) values ${newMembers.join()}`).run()

})
