const { mod : { muteRoleID }, logs : { modLog }} = require('../../../config/guild.json')
const modEmbed = require('../../registry/structures/modEmbed')
const actionsList = {

    Unban : ({mod, offender, guild, reason}) => {

        guild.members.unban(offender,`unban by ${mod.displayName}(${mod.id}) for following reason : "${reason}"`)

    },
    Unmute : ({ mod, offender, reason},db) => {

        if(offender.roles) offender.roles.remove(muteRoleID,`unmute by ${mod.displayName} for following reason '${reason}'`)
        else db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where offenderID = ${offender.id} and roleIDs not like ${muteRoleID}`)

    }

}

//I can't think of a name for the object with all the info like 
//who did ban/mute so naming it obj

module.exports = async (obj = { mod , offender, reason, action, guild},dbObj) => {

    const db = client.db
    if(!dbObj) dbObj = db.prepare(`select * from ${obj.action.substring(2)}sTable where offenderID = ${obj.offender.id} and status = 1`).get()
    obj.mod = obj.mod ?? obj.guild.me
    obj.id = dbObj.ID

    actionsList[obj.action](obj,db)
    
    db.prepare(`update modsTable set status = 0, reasonOfExemption = ?, modForExemption = ?,action = ? where ID = ${obj.id}`).run(obj.reason,obj.mod.id,obj.action.substring(2))    

    obj.guild.channels.cache.get(modLog).send({
        embed : new modEmbed(obj)
        .addField(`Mod responsible for punishment :`,`<@${dbObj.modID}> (${dbObj.modID})`)
        .addField(`Reason for punishment :`,dbObj.reason)
        .setTimestamp(dbObj.time)
    })

}