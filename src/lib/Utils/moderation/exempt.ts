import { GuildMember, Snowflake, TextChannel } from "discord.js"
import { moderationObject } from '@structures/types'
import { modEmbed } from '@structures/modEmbed'
import DataBase from 'better-sqlite3'

type config = { mod : { muteRoleID : Snowflake},
    logs : { modLog : Snowflake | TextChannel } 
}
let { mod : { muteRoleID }, logs : { modLog }} : config = require('@config')

//exemption actions along with what is done for each one.
const actionsList = {

    Unban : ({mod, offender, reason} : moderationObject) => {

        mod.guild.members.unban(offender,`unban by ${mod.displayName}(${mod.id}) for following reason : "${reason}"`)

    },
    Unmute : ({ mod, offender, reason} : moderationObject,db : any) => {


        if(offender instanceof GuildMember) offender.roles.remove(muteRoleID,`unmute by ${mod.displayName} for following reason '${reason}'`)
        else db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where offenderID = ${offender.id} and roleIDs not like ${muteRoleID}`)

    }

}
type dbObj = { ID : string, modID : string, reason : string, time : string, logURL : string }
export async function exempt(obj : moderationObject & { action : 'Unban' | 'Unmute'}){

    //creating connection with db
    const db = new DataBase('./modDB.db')
    
    //fetching info from db. 
    //Look at dbObj for expected output
    const dbObj = db.prepare(`select * from ${obj.action.substring(2)}sTable where offenderID = ${obj.offender.id} and status = 1`).get() as dbObj

    //doing the "exemption"
    actionsList[obj.action](obj,db)

    //updating the db about it.
    db.prepare(`update modsTable set status = 0, reasonOfExemption = ?, modForExemption = ?,action = ? where ID = ${dbObj.ID}`)
    .run(obj.reason,obj.mod.id,obj.action.substring(2));

    //checking modLog
    if(!(modLog instanceof TextChannel)){

        const c = obj.mod.guild.channels.cache.get(modLog)
        if(c instanceof TextChannel) modLog = c
        else throw new Error('modLog not found. Check the id')

    }

    //sending a message to logs
    modLog.send({

        embed : new modEmbed(obj)
        .addField(`Mod responsible for punishment :`,`<@${dbObj.modID}> (${dbObj.modID})`)
        .addField(`Reason for punishment :`,dbObj.reason)
        .setTimestamp(new Date(dbObj.time))
        .setURL(dbObj.logURL)

    })

    db.close()

}