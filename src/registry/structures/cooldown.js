const moderate = require("../../functions/moderation/moderate")
const { time2MS, MS2String} = require('../../functions/timeFunctions')

module.exports = class cooldown {

    constructor(name,ids = [],ratelimits = []){

        this.name = name
        this.ratelimits = ratelimits.sort((a,b) => b.amount - a.amount)
        this.map = new Map()
        ids.forEach(id => this.map.set(id,[]))

    }

    add(id,obj = {},offender,guild){

        let arr
        obj._time = obj.createdAt.getTime() || (new Date()).getTime()

        if(this.map.has(id)) (arr = this.map.get(id)).push(obj)
        else this.map.set(id,arr = [obj])

        for(let ratelimit of this.ratelimits){

            if(ratelimit.amount > arr.length) break
            if(arr[arr.length - 1]._time - arr[arr.length - ratelimit.amount]._time <= ratelimit.time*1000){

                const punishments = ratelimit.punishments
                let result

                if(result = punishments.join().match(/(?:warn|mute|kick|ban)(?: [0-9]+[s,m,h,d,M,y])?/g)) result.forEach(action => {

                    let time
                    [action,time] = action.split(" ")

                    if(time){

                        time = time2MS(time)
                        time = { ms : time, string : MS2String(time) }

                    }                    

                    moderate({ offender, time, action, guild, reason : `done by automod for hitting ratelimit of ${ratelimit.amount} ${this.name} in ${MS2String(ratelimit.amount*1000)}` } )

                })
                if(punishments.includes('delete')){

                    obj.delete()
                    obj.deleted = true

                }
                else if(punishments.includes('deleteAll')){

                    arr.filter(obj => !obj.deleted).forEach(obj => {

                        obj.delete()
                        obj.deleted = true

                    })

                }

            }

        }

        const ratelimit = this.ratelimits[this.ratelimits.length - 1]

        if(ratelimit.amount < arr.length || ratelimit.time*1000 < arr[arr.length - 1]._time - arr[0]._time)
        arr.shift()

    }

}