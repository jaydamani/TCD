const { MessageEmbed } = require("discord.js")


module.exports = class modEmbed extends MessageEmbed{
    constructor({ mod, offender, reason, action, time, id}){
        super({
            title : `${offender.displayName || `${offender.username}#${offender.discriminator}`}`,
            type : 'rich',
            description: ``,
            timestamp : new Date(),
            color : ``,
            fields : [
                {
                    name : `ID :`,
                    value : id,
                    inline : true
                },{
                    name : `Offender :`,
                    value : offender,
                    inline : true
                },{
                    name : `Offender ID`,
                    value : offender.id,
                    inline : true
                },{
                    name : `Moderator :`,
                    value : mod,
                    inline : true
                },{
                    name : `Moderator ID :`,
                    value : mod.id,
                    inline : true
                },{
                    name : `Reason :`,
                    value : reason,
                    inline : false
                }
            ]
        })
    }
}