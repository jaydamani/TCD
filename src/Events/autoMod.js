const baseEvent = require("../registry/structures/baseEvent")
const cooldown = require('../registry/structures/cooldown')
const users = client.users.cache.keyArray()
const ratelimits = config.ratelimits

const messageLimit = new cooldown('messages',users,ratelimits.message)
const linkLimit = new cooldown('links',users,ratelimits.link)
const attachmentLimit = new cooldown('attachments',users,ratelimits.attachment)
const mentionLimit = new cooldown('mentions',users,ratelimits.mention)
const inviteLimit = new cooldown('invites' ,users,ratelimits.invite)

module.exports =  new baseEvent('message',(message) => {

    if(message.author.bot) return
    if(!message.member) return
    if(!message.member.manageable) return
    let text = message.content
    let argz = [message.author.id,message,message.member,message.guild]
    
    messageLimit.add(...argz)
    if(text.match(/https?:\/\/(\w+.)+\w+/)) linkLimit.add(...argz)
    if(text.match(/discord.gg\/\w+ /)) inviteLimit.add(...argz)
    if(message.mentions.users.size) mentionLimit.add(...argz)
    if(message.attachments.size) attachmentLimit.add(...argz)

})