const baseEvent = require("../../registry/structures/baseEvent")
const cooldown = require('../../registry/structures/cooldown')
const config = require('../..//../config/guild.json')
const ratelimits = config.ratelimits
const Filter = require('bad-words')
const filter = new Filter({ emptyList : false, placeholder : '*'})
const { MessageEmbed } = require('discord.js')
const { logs : { modLog } } = config

const messageLimit = new cooldown('messages',[],ratelimits.message)
const linkLimit = new cooldown('links',[],ratelimits.link)
const attachmentLimit = new cooldown('attachments',[],ratelimits.attachment)
const mentionLimit = new cooldown('mentions',[],ratelimits.mention)
const inviteLimit = new cooldown('invites' ,[],ratelimits.invite)

module.exports =  new baseEvent('message',async (message) => {

    if(message.author.bot) return
    if(!message.member) return
    if(!message.member.manageable) return
    const text = message.content
    const argz = [message.author.id,message,message.member,message.guild]
 
    messageLimit.add(...argz)
    if(text.match(/https?:\/\/(\w+.)+\w+/)) linkLimit.add(...argz)
    if(text.match(/discord.gg\/\w+ /)) inviteLimit.add(...argz)
    if(message.mentions.users.size) mentionLimit.add(...argz)
    if(message.attachments.size) attachmentLimit.add(...argz)

    if(filter.isProfane(message.content)){

        const log = message.channels.cache.get(modLog)
        message.delete()
        const warnMessage = await message.channel.send(`${message.author}, please don't swear much. There are kids here like me :pleading_face:`)
        log.send({ embed :new MessageEmbed({

            title : `${message.author} sweared.`,
            description : `He said "${message.content}"`,
            url : warnMessage.url

        })})

    }
})
