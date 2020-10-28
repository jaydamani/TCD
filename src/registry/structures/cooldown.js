module.exports = class cooldown {
    constructor(ids = [],rateLimits){

        this.rateLimits = rateLimits.sort((a,b) => b.amount - a.amount)
        this.map = new Map()
        ids.forEach(id => this.map.set(id,[]))

    }

    add = (id,obj = {},...argz) => {

        let arr
        obj._time = obj.createdAt.getTime() || (new Date()).getTime()
        
        if(this.map.has(id)) (arr = this.map.get(id)).push(obj)
        else this.map.set(id,arr = [obj])


        for(let rateLimit of this.rateLimits){

            if(rateLimit.amount > arr.length) break
            if(arr[arr.length - 1]._time - arr[arr.length - rateLimit.amount]._time <= rateLimit.time*1000)
            rateLimit.execute(arr,...argz)

        }

        let rateLimit = this.rateLimits[this.rateLimits.length - 1]
        if(rateLimit.amount < arr.length || rateLimit.time*1000 < arr[arr.length - 1]._time - arr[0]._time)
        arr.shift().id
        console.log(arr.map(m => m.id))
    }

    

}