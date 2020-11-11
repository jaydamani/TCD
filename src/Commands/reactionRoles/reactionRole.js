const baseCommand = require('C:\Users\genius\Desktop\TCD-1\src/registry/structures/baseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = new baseCommand('rr',[],(cmd,argz,message) => {

    if(message.member.hasPermission)

    let db = client.db
    let guild = message.guild
    let reactionRoles = client.reactionRoles
    let message = argz.shift()
    let channel = argz[0]
    let reactionRoles = argz

    if(/<#[0-9]+>/.test(channel)){

        channel = message.mentions.channel.first()
        argz.shift()

    }
    else channel =  guild.channels.cache.get(config.rr.channel) || message.channel

    channel.messages.fetch(message).then(async rrMessage => {

        let rrArray = argz.join(' ').split(/:(?:\w+:(\d{15,})|(\w+)): /)
        let obj = {}
        let embed = new MessageEmbed({

            title : 'Reaction Roles',
            description : `This are the reactions and roles below them will be given if someone reacts with the given reaction to discord.com/${guild.id}/${channel.id}/${rrMessage.id}\nReact with \u2705 to confirm and \u2612 to deny`,
            color : 'random'

        })

        for (let i = 0; i < rrAnray.length/2; i++) {
            
            let reaction = rrArray[2 * i - 1]
            let roles = rrArray[2 * i].split()

            roles = roles.map(r => {
                
                let role = guild.roles.find(role => role.id == `<&${r}>` || role.name == r || role.id == r)
                if(!role) message.channel.send(`Can not resolve ${r}, so it will be skipped`)
                else return role

            }).filter(r => r)

            obj[reaction] = { roles, reaction, onReaction : 1, onRemoval : 0}
            embed.addField(`:${reaction}: :`,roles.map(r => `<&r.id>`).join(),true)

        }

        message = await message.channel.send({ embed })
        message.react('\u2705')
        message.react('\u2612')

        let collector = message.createReactionCollector(reaction => reaction.name == '\u2612' || reaction.name == '\u2705',{ maxEmojis : 1 })

        collector.on('collect',(reaction, user) => {

            if(reaction.name == '\u2612') return message.channel.send('Command cancelled')
            else{

                let reactionRoles = client.reactionRoles

                if(reactionRoles[rrMessage.id]){

                    

                }
                else reactionRoles[rrMessage.id] 

            }

        })

    }).catch(err => {

        if(err.message == 'Unknown Message') message.channel.send('Can not find a message with given ID.')

    })

})