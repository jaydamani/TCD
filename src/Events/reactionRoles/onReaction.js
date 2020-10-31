const baseEvent = require("../../registry/structures/baseEvent")
let reactionRoles = client.reactionRoles

module.exports = new baseEvent('messageReactionAdd',(reaction,user) => {

    if(!reactionRoles.has(reaction.id + reaction.message.id)) return
    
    let message = reaction.message.partial ? reaction.message.fetch() : reaction.message    
    let guild = message.guild
    let roles = reactionRoles.get(reaction.id + reaction.message.id).onAdd

    guild.members.fetch(user).then(member => {

        member.roles.add(roles.toAdd)
        member.roles.remove(roles.toRemove)

    })

})