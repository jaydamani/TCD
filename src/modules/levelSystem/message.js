const baseEvent = require("../../registry/structures/baseEvent");
const lastXPGiven = new Map()
const config = require('../../../config/guild.json')
const a = require('../../functions/toTemplate');

module.exports = new baseEvent('message',( message, { getXP, setXP } ) => {

    const xpMap = obj.xpMap
    if(message.author.bot) return
    if((message.createdAt - lastXPGiven.get(message.author.id)) < config.xp.cooldown*1000) return

    lastXPGiven.set(message.author.id, message.createdAt.getTime())

    const obj = xpMap.get(message.author.id)

    if(!obj) xpMap.set(message.author.id, obj = { xp : 0, lvl : 1 })

    obj.xp += Math.floor(Math.random()*(config.xp.max - config.xp.min) + config.xp.min)
    obj.wasUpdated = true

    if(obj.xp >= obj.xpForNextLevel(obj.level)){

        const channel = message.guild.channels.cache.get(config.xp.levelChannel)
        ?? message.channel
        obj.xp -= result
        obj.level++
        channel.send(a(config.xp.message,{ message, obj, user : message.member }))

    }

})