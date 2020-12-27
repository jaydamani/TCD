const baseEvent = require("../../registry/structures/baseEvent")
const config = require('../../../config/guild.json')

module.exports = new baseEvent('ready',obj => {

    const db = obj.db
    const dbArray = db.prepare('select * from xpTable').all()
    let syncedIDs = dbArray.map(a => a.memberID)
    const xpMap = obj.xpMap = new Map()
    dbArray.forEach(a => xpMap.set(a.memberID, a))

    setInterval(() => {

        const newIDs = Array.from(xpMap.entries())
        const updated  = newIDs.filter(a => a[1].wasUpdated)
        const added = newIDs.filter(a => !syncedIDs.includes(a[0]))
        .map(a => `('${a[0]}',${a[1].xp},${a[1].level})`).join()

        for (const [memberID,xpObj] of updated) {

            db.prepare(`update xpTable set xp = ${xpObj.xp} level = ${xpObj.level} where memberID = ${memberID}`)
            xpObj.wasUpdated = false

        }

        if(added) db.prepare(`insert into xpTable (memberID,xp,level) values ${added}`).run()
        syncedIDs = newIDs.map(a => a[0])

    }, 300000);

})
