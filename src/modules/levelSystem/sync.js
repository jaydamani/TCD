const baseEvent = require("../../registry/structures/baseEvent")
const config = require('../../../config/guild.json')
module.exports = new baseEvent('ready',obj => {

    const dbArray = obj.db.prepare('select * from xpTable').all()
    let syncedIDs = dbArray.map(a => a.memberID)
    const xpMap = obj.xpMap = new Map()
    dbArray.forEach(a => xpMap.set(a.memberID,{ xp : a.xp, lvl : a.level, image : a.imageURL, color : a.color ?? config.color }))
    
    setInterval(() => {

        const newIDs = Array.from(xpMap.entries())
        const updated  = newIDs.filter(a => a[1].wasUpdated)
        const updateString = updated.map(a => `memberID = ${a[0]}`).join(' or ')
        const added = newIDs.filter(a => !syncedIDs.includes(a[0]))
        .map(a => `('${a[0]}',${a[1].xp},${a[1].lvl})`).join()

        if(added) db.prepare(`insert into xpTable (memberID,xp,level) values ${added}`).run()
        if(updateString) db.prepare(`update xpTable set xp = get('xpMap',memberID,'xp'), level = get('xpMap',memberID,'lvl') where ${updateString}`).run()
        syncedIDs = newIDs.map(a => a[0])
        xpMap.forEach(v => v.wasUpdated = false)

    }, 60000);

})
