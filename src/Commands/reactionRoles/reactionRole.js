const baseCommand = require('../../registry/structures/baseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = new baseCommand('rr',[],async (cmd,argz,message) => {

    if(!message.member.hasPermission(8)) return message.channel.send('You do not have required permissions')

    let db = client.db
    let guild = message.guild
    let rrMessage = argz.shift()
    let channel = argz[0]

    if(channel = channel.match(/<#([0-9]+)>/)){

        channel = guild.channels.cache.get(channel[1])
        argz.shift()

    }
    else channel =  guild.channels.cache.get(config.rr.channel) ?? message.channel
    
    try {

        rrMessage = await channel.messages.fetch(rrMessage)

    } catch (err) {
        
        if(err.message == 'Unknown Message') return message.channel.send('Can not find the given message')
        else throw err

    }

    let rrArray = (argz.join(' ').split(/<:.+:([0-9]{15,})> |(\p{So}) /u)).filter(r => r)
    let obj = {}
    let embed = new MessageEmbed({

        title : 'Reaction Roles',
        description : `This are the reactions and roles below them will be given if someone reacts with the given reaction to https://discord.com/${guild.id}/${channel.id}/${rrMessage.id}\nReact with \u2705 to confirm and \u274c to deny`,
        color : 'random'

    })
    console.log(rrArray,69)
    for (let i = 1; i <= rrArray.length/2; i++) {
        
        let reaction = rrArray[2 * i - 2]
        let roles = rrArray[2 * i - 1].split()
        
       roles = roles.map(rInput => {

            let role = guild.roles.cache.find(r => rInput == `<@&${r.id}>` || r.name.toLowerCase().includes(rInput.toLowerCase()) || r.id == rInput)
            if(!role){
                console.log(role,'no role')
                
                message.channel.send(`Can not resolve "${rInput}", so it will be skipped`)
                return undefined

            }
            console.log(role)
            return role
        
        }).filter(r => r).map(r => r.id)
        console.log(roles,roles.length)
        if(roles.length == 0) return message.channel.send(`no roles for ${reaction}`)
        
        obj[reaction] = { roles, reaction, onReaction : 1, onRemoval : 0}
        embed.addField(`:${reaction}: :`,roles.map(r => `<&r.id>`).join(' ') ?? '\u200b',true)

    }
    
    if(obj == {}) return message.channel.send(`no reaction roles resolved`)

    message = await message.channel.send({ embed })
    await message.react('\u2705')
    await message.react('\u274c')

    let collector = message.createReactionCollector((reaction,user) => user.id == message.author.id,{ })

    collector.on('collect',(reaction, user) => {
        console.log('collected!!!!!!',user.name,reaction.na)

        if(reaction.name == '\u274c') return message.channel.send('Command cancelled')
        let reactionRoles = client.reactionRoles

        if(reactionRoles[rrMessage.id]){

            for (const reaction in obj) {

                if(reactionRoles[rrMessage.id][reaction]){
                    console.log(reactionRoles[rrMessage.id],reaction)
                    if(result = reactionRoles[rrMessage.id][reaction]){

                        if(a = result?.find()) a.roles = a.roles.concat(obj[reaction].roles)
                        else result.push(obj[reaction])

                    }
                    else reactionRoles[rrMessage.id][reaction] = [obj[reaction]]

                }
                else reactionRoles[rrMessage.id][reaction] = [obj[reaction]]

            } 

        }
        else reactionRoles[rrMessage.id] = obj

    })

})