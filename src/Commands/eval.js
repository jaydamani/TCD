const baseCommand = require('../registry/structures/baseCommand')
const { canEval } = require('../../config/bot.json')
const discord = require("discord.js")

module.exports = new baseCommand('eval',['run'],async (cmd,argz,message) => {

    if(!canEval.includes(message.author.id) && message.author.id != `429606655320391680`) return message.channel.send(`lol, noob`)

    let code = argz.join(' ')
    let start = process.hrtime();

        (new Promise(r => r(eval(code)))).then(a => {

            message.channel.send({
                
                embed : new discord.MessageEmbed()
                .setDescription(JSON.stringify(a))
                .setFooter(process.hrtime(start))

            })

        }).catch(err => {
            message.channel.send({

                embed : new discord.MessageEmbed()
                .setDescription(err)
                .setFooter(process.hrtime(start))

            })
        })

})