const { MessageEmbed } = require("discord.js")


module.exports = class modEmbed extends MessageEmbed{
    constructor({ mod, offender, reason, action, time, id}){
        super({
            title : `A ${action.name} was done.`,
            type : 'rich',
            description: ``,
            timestamp : new Date(time),
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