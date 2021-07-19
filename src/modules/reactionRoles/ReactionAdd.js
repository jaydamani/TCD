const BaseEvent = require('../../registry/structures/BaseEvent');

module.exports = new BaseEvent('messageReactionAdd',(reaction, user,reactionRoles) => {
    console.log(reactionRoles)
    if(!reactionRoles.hasOwnProperty(reaction.message.id)) return

    reactionRoles = reactionRoles[reaction.message.id]
    if(!reactionRoles.hasOwnProperty(reaction.emoji.id ?? reaction.emoji.name)) return

    reactionRoles = reactionRoles[reaction.emoji.id ?? reaction.emoji.name]

    let rolesToAdd = ''
    let rolesToRemove = ''
    const member = reaction.message.guild.members.cache.get(user.id)

    reactionRoles.forEach((obj) => {

        if(obj.onReaction) rolesToAdd += obj.roles
        else if(obj.onReaction == 0) rolesToRemove += obj.roles

    })

    if(rolesToAdd) member?.roles.add(rolesToAdd.split())
    if(rolesToRemove) member?.roles.remove(rolesToRemove.split())

})