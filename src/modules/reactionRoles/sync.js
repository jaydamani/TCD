const BaseEvent = require('../../registry/structures/BaseEvent');

module.exports = new BaseEvent('ready',reactionRoles => {

    const dbObj = reactionRoles.db.prepare('select * from reactionRoles').all()

    dbObj.forEach((obj) => {

        let array = ((reactionRoles[obj.messageID] ??= {})[obj.reaction] ??= [])

        if(result = array.find(r => r.onRemoval == obj.onReaction && r.onReaction == obj.onRemoval)) result.roles += obj[reaction].roles
        else array.push(obj)
        

    })

})