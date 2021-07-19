import { BaseEvent } from '@structures/BaseEvent'
import { Snowflake } from 'discord.js'

export type xpObj = { xp : number, level : number, wasUpdated? : boolean, memberID : Snowflake }

const xpMap : Map<Snowflake, xpObj> = new Map()
const xpForNextLevel = (level : number) => 5*(level**2) + 50*level + 100

new class Event extends BaseEvent{

    name : BaseEvent.name = 'ready'
    run : BaseEvent.ready = () => {

        const db = new (require('better-sqlite3'))('./mod.DB')
        const dbArray = db.prepare('select * from xpTable').all()
        dbArray.forEach(a => xpMap.set(a.memberID,a))

        setInterval(() => {

            const changed = Array.from(xpMap.values()).filter(a => a.wasUpdated).map(a => `(${a.memberID},${a.xp},${a.level})`).join(' ')
            db.prepare(`REPLACE INTO xpTable (memberID, xp, level) VALUES ${changed}`).run()

        }, 5*60*1000)

    }

}
export { xpMap, xpForNextLevel }