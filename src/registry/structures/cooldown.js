const moderate = require("../../functions/moderation/moderate")

module.exports = class cooldown {

    constructor(ids = [],ratelimits = []){

        this.ratelimits = ratelimits.sort((a,b) => b.amount - a.amount)
        this.map = new Map()
        ids.forEach(id => this.map.set(id,[]))

    }

    add(id,obj = {},...argz){

        let arr
        obj._time = obj.createdAt.getTime() || (new Date()).getTime()
        
        if(this.map.has(id)) (arr = this.map.get(id)).push(obj)
        else this.map.set(id,arr = [obj])


        for(let ratelimit of this.ratelimits){

            if(ratelimit.amount > arr.length) break
            if(arr[arr.length - 1]._time - arr[arr.length - ratelimit.amount]._time <= ratelimit.time*1000){
                let punishments = ratelimit.punishments

                if(punishments.includes('warn')){

                }
                if(punishments.includes('mute')){

                }
                if(punishments.includes('kick')){

                }
                if(punishments.includes('ban')){

                }
                if(punishments.includes('delete')){

                }
                if(punishments.includes('deleteAll')){

                }

            }

        }

        let ratelimit = this.ratelimits[this.ratelimits.length - 1]
        if(ratelimit.amount < arr.length || ratelimit.time*1000 < arr[arr.length - 1]._time - arr[0]._time)
        arr.shift()

    }

}