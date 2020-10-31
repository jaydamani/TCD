const baseEvent = require("../../registry/structures/baseEvent");

module.exports = new baseEvent('ready',() => {

    let db = client.db
    //reaction roles DB
    let rrdb = db.prepare('select * from reactionRoles').all()
    let reactionsRoles = client.reactionRoles = new Map()

    for (const rr of rrdb) {
        
        reactionsRoles.set(ID,{
            onReaction : {
                toAdd : rr.rolesToAddOnReaction,
                toRemove : rr.rolesToRemoveOnReaction
            },
            onRemoval : {
                toAdd : rr.rolesToAddOnRemoval,
                toRemove : rr.rolesToRemoveOnRemoval
            }
        })

    }

})