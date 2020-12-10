const baseEvent = require('../../registry/structures/baseEvent');

module.exports = new baseEvent('messageReactionAdd',(reaction, user) => {

    let reactionRoles = client.reactionRoles
    if(!reactionRoles.hasOwnProperty(reaction.message.id)) return

    reactionRoles = reactionRoles[reaction.message.id]
    if(!reactionRoles.hasOwnProperty(reaction.identifier)) return

    reactionRoles = reactionRoles[reaction.identifier]
    let rolesToAdd = ''
    let rolesToRemove = ''
    let member = reaction.message.guild.members.cache.get(user.id)

     reactionRole.forEach((obj) => {

        if(obj.onReaction) rolesToAdd += obj.roles
        else if(obj.onReaction == 0) rolesToRemove += obj.roles

    })

    member?.roles.add(rolesToAdd.split())
    member?.roles.remove(rolesToRemove.split())

})