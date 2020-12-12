const baseEvent = require('../../registry/structures/baseEvent');

module.exports = new baseEvent('ready',() => {

    const dbObj = client.db.prepare('select * from reactionRoles').all()

    const reactionRoles = client.reactionRoles = {}
    
    dbObj.forEach((obj) => {

        let array = ((reactionRoles[obj.messageID] ??= {})[obj.reaction] ??= [])

        if(result = array.find(r => r.onRemoval == obj.onReaction && r.onReaction == obj.onRemoval)) result.roles += obj[reaction].roles
        else array.push(obj)
        

    })

})