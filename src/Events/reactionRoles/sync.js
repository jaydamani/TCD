const baseEvent = require('C:\Users\genius\Desktop\TCD-1\src/registry/structures/baseEvent');

module.exports = new baseEvent('ready',() => {

    let dbObj = client.db.prepare('select * from reactionRoles').all()

    let reactionRoles = client.reactionRoles = {}
    dbObj.forEach((obj) => {

        if(reactionRoles.hasOwnProperty(obj.messageID)){

            if(reactionRoles[obj.messageID].hasOwnProperty(obj.reaction))
            reactionRoles[obj.messageID][obj.reaction].push(obj)
            else reactionRoles[obj.messageID][obj.reaction] = [obj]

        }
        else{

            reactionRoles[obj.messageID] = {}
            reactionRoles[obj.messageID][obj.reaction] = [obj]

        }

    })

})