const baseEvent = require("../../registry/structures/baseEvent");
const lastXPGiven = new Map()
const config = require('../../../config/guild.json')
const a = require('../../functions/toTemplate');

module.exports = new baseEvent('message',( message, obj ) => {

    const xpMap = obj.xpMap
    if(message.author.bot) return
    if((message.createdAt - lastXPGiven.get(message.author.id)) < config.xp.coolDown*1000) return

    lastXPGiven.set(message.author.id, message.createdAt.getTime())

    let xp = xpMap.get(message.author.id)

    if(!xp) xpMap.set(message.author.id,xp = { xp : 0, lvl : 1 })
    else xp.wasUpdated = true

    xp.xp += Math.floor(Math.random()*(config.xp.max - config.xp.min) + config.xp.min)

    if(xp.xp >= (result = 5*(xp.lvl**2) + 50*xp.lvl + 100)){

        const channel = message.guild.channels.cache.get(config.xp.levelChannel)
        ?? message.channel
        xp.xp -= result
        xp.lvl++
        channel.send(a(config.xp.message,{ message, xp }))

    }

})