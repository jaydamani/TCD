const baseEvent = require("../../registry/structures/baseEvent")
const config = require('../../../config/guild.json')

module.exports = new baseEvent('ready',obj => {

    const db = obj.db
    const xpMap = obj.xpMap = new Map() 
    const dbArray = db.prepare('select * from xpTable').all()
    dbArray.forEach(a => obj[a.memberID] = a)
    obj.xpForNextLevel = level => 5*(level**2) + 50*level + 100

    setInterval(() => {

        const changed = xpMap.values().filter(a => a.wasUpdated).map(a => `(${a.memberID},${a.xp},${a.level})`).join(' ')
        db.prepare(`REPLACE INTO xpTable (memberID, xp, level) VALUES ${changed}`).run()

    }, 5*60*1000)

})
