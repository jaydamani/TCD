const baseEvent = require("../../registry/structures/baseEvent");
const lastXPGiven = new Map()

module.exports = new baseEvent('message',( message, obj ) => {
    console.log(obj,69)
    const xpMap = obj.xpMap
    if(message.author.bot) return
    if(message.createdAt - lastXPGiven.get(message.author.id) < config.xp.coolDown/1000) return

    lastXPGiven.set(message.author.id, message.createdAt.getTime())

    //const channel = message.guild.channels.cache.get(config.xp.levelChannel) ?? message.channel
    let xp = xpMap.get(message.author.id)

    if(!xp) xpMap.set(message.author.id,xp = { xp : 0, lvl : 1 })
    else xp.wasUpdated = true

    xp.xp += Math.floor(Math.random()*(config.xp.max - config.xp.min) + config.xp.min)

    if(xp.xp >= (result = 5*(xp.lvl**2) + 50*xp.lvl + 100)){

        xp.xp -= result
        xp.lvl++
        //channel.send(``)

    }

})