import { BaseEvent } from '@structures/BaseEvent'
import { Snowflake, TextChannel } from 'discord.js'
import { toTemplate } from "@src/lib/Utils/toTemplate";
import { xpMap, xpForNextLevel } from './sync'

const { xp : { cooldown, max, min, levelChannel, levelUpMessage } } = require('@config')

const lastXPGiven : Map<Snowflake,Date> = new Map()

new class Event extends BaseEvent{

    name : BaseEvent.name = 'message'
    run : BaseEvent.message = (message) => {

        if(message.author.bot) return
        if((+message.createdAt - +(lastXPGiven.get(message.author.id) ?? 0)) < cooldown*1000) return
        
        let obj = xpMap.get(message.author.id)

        if(!obj) xpMap.set(message.author.id, obj = { xp : 0, level : 1, memberID : message.author.id })

        obj.xp += Math.floor(Math.random()*(max - min) + min)
        obj.wasUpdated = true

        let result : number
        if(obj.xp >= (result = xpForNextLevel(obj.level))){

            const channel = message.guild?.channels.cache.get(levelChannel)
            ?? message.channel
            obj.xp -= result
            obj.level++
            (channel as TextChannel).send(toTemplate(levelUpMessage,{ message, obj, user : message.member }))

        }

    }

}