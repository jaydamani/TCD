const baseEvent = require("../../registry/structures/baseEvent");
const config = config.xp
const db = client.db

module.exports = new baseEvent('ready',() => {

    const dbArray = db.prepare('select * from xpTable').all()
    const syncedIDs = dbArray.map(a => a.memberID)
    const xpMap = client.xpMap = new Map()
    dbArray.forEach(a => xpMap.set(a.memberID,{ xp : a.xp, lvl : a.level, image : a.imageURL, color : a.color ?? config.color }))
    
    setInterval(() => {

        const newIDs = xpMap.entries()
        const updateString = newIDs.filter(a => a[1].wasUpdated)
        .map(a => `memberID = ${a[0]}`).join(' or ')
        const added = newIDs.filter(a => !syncedIDs.includes(a[0]))
        .map(a => `(${a[0]},${a[1].xp},${a[1].lvl})`).join()

        if(added) db.prepare(`insert into xpTable (memberID,xp,level) values ${added}`)
        if(updateString) db.prepare(`update xpTable set xp = get('xpMap',memberID,'xp'), level = get('xpMap',memberID,'level') where ${updateString}`).run()
        syncedIDs = newIDs

    }, 60*1000);

})
