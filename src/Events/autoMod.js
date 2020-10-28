const baseEvent = require("../registry/structures/baseEvent");
const cooldown = require('../registry/structures/cooldown')
const users = client.users.cache.keyArray()
const ratelimits = config.ratelimits

const messageLimit = new cooldown(users,ratelimits.message)
const linkLimit = new cooldown(users,ratelimits.link)
const attachmentLimit = new cooldown(users,ratelimits.attachment)
const mentionLimit = new cooldown(users,ratelimits.mention)
const inviteLimit = new cooldown(users,ratelimits.invite)

module.exports =  new baseEvent('message',(message) => {

    let text = message.content
    let argz = [message.author.id,message,message.member]
    
    messageLimit.add(...argz)
    if(text.match(/https?:\/\/(\w+.)+\w+/)) linkLimit.add(...argz)
    if(text.match(/discord.gg\/\w+ /)) inviteLimit.add(...argz)
    console.log(message.attachments.size)
    if(message.mentions.users.size) mentionLimit.add(...argz)
    if(message.attachments.size) attachmentLimit.add(...argz)

})