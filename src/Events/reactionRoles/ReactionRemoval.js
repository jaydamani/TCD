const baseEvent = require('C:\Users\genius\Desktop\TCD-1\src/registry/structures/baseEvent');

module.exports = new baseEvent('messageReactionRemove',(reaction, user) => {

    let reactionRoles = client.reactionRoles
    if(!reactionRoles.hasOwnProperty(reaction.message.id)) return

    reactionRoles = reactionRoles[reaction.message.id]
    if(!reactionRoles.hasOwnProperty(`${reaction.name}:${reaction.id}`)) return

    reactionRoles = reactionRoles[reaction.name + reaction.id]
    let rolesToAdd = ''
    let rolesToRemove = ''
    let member = reaction.message.guild.members.cache.has(user.id)

     reactionRole.forEach((obj) => {

        if(obj.onRemoval) rolesToAdd += obj.roles
        else if(obj.onRemoval == 0) rolesToRemove += obj.rolesToAdd
    
    })

    member.roles.add(rolesToAdd.split())
    member.roles.remove(rolesToRemove.split())

})