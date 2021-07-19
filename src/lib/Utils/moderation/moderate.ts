import { client, db } from '@main'
import { GuildMember, Snowflake, TextChannel } from "discord.js"
import { modAction, moderationObject} from '@structures/types'
import { modEmbed } from '@structures/modEmbed'
import { exempt } from '@src/lib/Utils/moderation/exempt'
import { type } from 'os'

type config = { mod : { muteRoleID : Snowflake}, logs : { modLog: Snowflake } }
const { mod : { muteRoleID },logs : { modLog }} = require('../../../config/guild.json')

const actionsList = {

    //warn is here in case something extra needs to be done. Like a warned role or probably some sort of cooldown
    warn : ({ mod, offender, reason } : moderationObject) => {},

    ban : ({ mod, offender, reason, time } : moderationObject) => {

        //using guild.members.ban so that offender can be banned 
        //even if he is not a member of the guild
        mod.guild.members.ban(offender,{ reason : `banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time?.string}.`})

        if(time) delay(exempt,time.ms,{  mod : mod.guild.me as GuildMember,
            reason : `Done by automod as the ban was only${time.string}`,
            offender, action : 'Unban'  })

    },
    mute : ({ mod, offender, reason, time } : moderationObject,db : any) => {

        if(offender instanceof GuildMember){

            offender.roles.add(muteRoleID,`muted by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time?.string ?? ''}.`)

        }else db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where memberID = ${offender.id}`).run()

        if(time) setTimeout(exempt, time.ms)

    },

    kick : ({ mod, offender, reason } : moderationObject) => {

        (offender as GuildMember).kick(`banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'.`)

    }

}

export async function moderate(obj : moderationObject & { action : modAction}){

    actionsList[obj.action](obj,db)

    const c = await obj.mod.guild.channels.cache.get(modLog)

    const { lastInsertRowid } = db
    .prepare(`insert into modsTable (offenderID,modID,reason,action,timeOfExemption) values (?,?,?,?,?,?)`)
    .run(obj.offender.id,obj.mod.id,obj.reason,obj.action,
    obj.time ? new Date(obj.time.ms) : null)

    obj.id = +lastInsertRowid

    if(c instanceof TextChannel)
    c.send(obj.offender.id,new modEmbed(obj))

}