const baseEvent = require('../../registry/structures/baseEvent');

module.exports = new baseEvent('messageReactionRemove',(reaction, user) => {

    const reactionRoles = client.reactionRoles
    if(!reactionRoles.hasOwnProperty(reaction.message.id)) return

    reactionRoles = reactionRoles[reaction.message.id]
    if(!reactionRoles.hasOwnProperty(reaction.emoji.id ?? reaction.emoji.name)) return

    reactionRoles = reactionRoles[reaction.emoji.id ?? reaction.emoji.name]
    let rolesToAdd = ''
    let rolesToRemove = ''
    let member = reaction.message.guild.members.cache.get(user.id)

     reactionRoles.forEach((obj) => {

        if(obj.onRemoval) rolesToAdd += obj.roles
        else if(obj.onRemoval == 0) rolesToRemove += obj.roles

    })

    if(rolesToAdd) member?.roles.add(rolesToAdd.split())
    if(rolesToRemove) member?.roles.remove(rolesToRemove.split())

})