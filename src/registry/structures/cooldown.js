module.exports = class cooldown{
    constructor(){
        this.map = new Map()
    }
    add = (id) => {
        let arr
        if(this.map.has(id)) arr = this.map.get(id).push((new Date()).getTime())
        else this.map.set(id,arr = [new Date().getTime])
        
        

    }
}