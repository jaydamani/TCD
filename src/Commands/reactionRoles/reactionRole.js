const baseCommand = require('../../registry/structures/baseCommand');
const { MessageEmbed, Util : { parseEmoji } } = require('discord.js');

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

    let rrArray = (argz.join(' ').split(/(<a?:.+:[0-9]{15,}>) |(\p{S}) /u)).filter(r => r)
    let array = []
    let embed = new MessageEmbed({

        title : 'Reaction Roles',
        description : `This are the reactions and roles below them will be given if someone reacts with the given reaction to https://discord.com/${guild.id}/${channel.id}/${rrMessage.id}\nReact with \u2705 to confirm and \u274c to deny`,
        color : 'random'

    })

    for (let i = 1; i <= rrArray.length/2; i++) {

        let reaction = rrArray[2 * i - 2]
        let roles = rrArray[2 * i - 1].split()
        let reactionObj = parseEmoji(reaction)

        if(reactionObj.id && !client.emojis.cache.has(reactionObj.id)) return message.channel.send('bot can not access the given emoji.')

        roles = roles.map(rInput => {

            let role = guild.roles.cache.find(r => rInput == `<@&${r.id}>` || r.name.toLowerCase().includes(rInput.toLowerCase()) || r.id == rInput)
            if(!role){

                message.channel.send(`Can not resolve "${rInput}", so it will be skipped`)
                return undefined

            }

            return role

        }).filter(r => r).map(r => r.id).join()
        console.log(roles,roles.length)
        if(!roles) return message.channel.send(`no roles for ${reaction}`)

        rrMessage.react(reactionObj.id ?? reactionObj.name)
        array.push({ messageID : rrMessage.id, roles, reaction, reactionObj, onReaction : 1, onRemoval : 0})
        embed.addField('\u200b',`${reaction}\t: <@${roles.replace(',','>,<@')}>` ?? '\u200b',true)

    }

    if(!array.length) return message.channel.send(`no reaction roles resolved`)
    console.log(array)
    message = await message.channel.send({ embed })
    await message.react('\u2705')
    //setTimeout(() => message.react('\u274c'),1000)
    console.log('ratelimit?')

    let collector = message.createReactionCollector(() => true)

    collector.on('collect',(reaction, user) => {
        console.log('collected!!!!!!',user.username,reaction.id ?? reaction.name)

        let reactionRoles = client.reactionRoles

        if(reactionRoles[rrMessage.id]){

            let dbArray = []

            array.forEach((obj) => {

                let a = (reactionRoles[rrMessage.id][obj.reaction] ??= [])

                if(result = a.find(r => r.onRemoval == obj.onReaction && r.onReaction == obj.onRemoval)){

                    result.roles += obj[reaction].roles
                    db.prepare(`update reactionRoles set roles = ${result.roles} where messageID = @messageID and reaction = @reaction and onReaction = @onReaction and onRemoval = @onRemoval`,obj)

                } 
                else{

                    array.push(obj[reaction])
                    dbArray.push(`(${obj.messageID},${obj.reaction},${obj.roles},${obj.onReaction},${obj.onRemoval})`)

                }

            })

            if(dbArray.length) db.prepare(`insert into reactionRoles values ${dbArray.join()}`)

        }
        else{

            reactionRoles[rrMessage.id] = array.reduce((x,y) => (x[y.reaction] ??= []).push(y), {})
            db.prepare(`insert into reactionRoles values ${array.map(obj => `(${obj.messageID},${obj.reaction},${obj.roles},${obj.onReaction},${obj.onRemoval})`).join()}`).run()

        }

        array.forEach((a,i) => setTimeout(message.react,1000*i,a.reactionObj.name ?? a.reactionObj.id))

    })

})