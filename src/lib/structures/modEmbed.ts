import { moderationObject } from "./types"
import { MessageEmbed } from 'discord.js'

export class modEmbed extends MessageEmbed{
    constructor({ mod, offender, reason, action, time, id } : moderationObject & { action : string }){
        super({
            type : 'rich',
            description: ``,
            fields : [
                {
                    name : `Action`,
                    value : action,
                    inline : true
                },
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
                    name : `Time Of ${action} :`,
                    value : time?.string ?? 'Indefinitely',
                    inline : true
                },{
                    name : `Reason :`,
                    value : reason,
                    inline : false
                }
            ]
        })
        if(time) this.setTimestamp(new Date(time.ms))
        this.setColor('RANDOM')

    }
}