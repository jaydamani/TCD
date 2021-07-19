const BaseCommand = require('../../registry/structures/BaseCommand')
const { canEval } = require('../../../config/bot.json')
const discord = require("discord.js")

module.exports = new BaseCommand('eval',['run'],async (cmd,argz,message) => {

    if(!canEval?.includes(message.author.id) && message.author.id != `429606655320391680`) return message.channel.send(`lol, noob`)

    const code = argz.join(' ')
    const start = process.hrtime();

        (new Promise(r => r(eval(code)))).then(a => {

            message.channel.send({
                
                embed : new discord.MessageEmbed()
                .setDescription(JSON.stringify(a,null,3))
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
