import { time2MS, MS2String } from "@src/lib/Utils/timeFunctions"
import { moderate } from "@src/lib/Utils/moderation/moderate";
import { modAction } from '@structures/types'
import { Guild, GuildMember, Message, Snowflake } from "discord.js"

type obj = Message
type arr = { obj : obj, time : Date}[]

export class cooldown {

    name : string
    ratelimits : cooldown.ratelimit[]
    map : Map<Snowflake,arr> = new Map()

    constructor(name : string,ids : Snowflake[],ratelimits : cooldown.ratelimit[]){

        this.name = name
        this.ratelimits = ratelimits
        .sort((a,b) => b.amount - a.amount)
        .map(r => Object.defineProperty(r,'punishments',new Set(r.punishments)))
        ids.forEach(id => this.map.set(id,[]))

    }

    add(id : Snowflake,obj : obj,offender : GuildMember, guild : Guild){

        let arr : arr
        const time = obj.createdAt ?? new Date()

        if(this.map.has(id)) (arr = this.map.get(id)!).push({ time, obj})
        else this.map.set(id,arr = [{ obj, time }])

        for(let ratelimit of this.ratelimits){

            if(ratelimit.amount > arr.length) break
            if(+arr[arr.length - 1].time - +arr[arr.length - ratelimit.amount].time >= ratelimit.time*1000) continue

            const o = { mod : guild.me!, offender, 
            reason : `` }

            ratelimit.punishments
            .forEach(punishment => {

                if(typeof punishment != 'string'){

                    const ms = time2MS(punishment.time)
                    const time = { ms, string : MS2String(ms),
                    obj : new Date(ms) }
                    moderate({ ...o, action : punishment.name, time })
                    return

                }
                if(punishment == 'kick' || punishment == 'mute' ||
                punishment == 'ban' || punishment == 'warn'){

                    moderate({ ...o, action : punishment })

                }
                else if(punishment == 'delete') obj.delete()
                else if(punishment == 'deleteAll')
                arr.forEach(a => a.obj.delete())

            })

        }

        const ratelimit = this.ratelimits[this.ratelimits.length - 1]

        if(ratelimit.amount < arr.length
        || ratelimit.time*1000 < +arr[arr.length - 1].time - +arr[0].time)
        arr.shift()

    }

}

export module cooldown{

    type punishments = 'deleteAll' | 'delete' | modAction | { name : modAction, time : string }
    export type ratelimit = { amount : number, time : number,
    punishments :  Set<punishments> }

}

