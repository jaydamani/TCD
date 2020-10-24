const { mod : { muteRoleID }, logs : { modLog }} = require('../../../config/guild.json')
const modEmbed = require('../../registry/structures/modEmbed')
const actionsList = {

    Unban : ({mod, offender, guild, reason}) => {

        guild.members.unban(offender,`unban by ${mod.displayName}(${mod.id}) for following reason : "${reason}"`)

    },Unmute : ({ mod, offender, reason},db) => {

        if(offender.roles) offender.roles.remove(muteRoleID,`unmute by ${mod.displayName} for following reason '${reason}'`)
        else db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where offenderID = ${offender.id} and roleIDs not like ${muteRoleID}`)

    }

}

//I can't think of a name for the object with all the info like 
//who did ban/mute so naming it obj

module.exports = async (obj = { mod , offender, reason, action, guild},dbObj,db =  new require('better-sqlite3')('./modDB.db')) => {

    if(!dbObj){
    
        dbObj = db.prepare(`select * from ${obj.action.substring(2)}sTable where offenderID = ${obj.offender.id} and status = 1`).get()

    }
    
    obj.id = dbObj.ID
    console.log(obj.guild)
    actionsList[obj.action](obj,db)
    console.log(obj.id,dbObj)
    db.prepare(`update ${obj.action.substring(2)}sTable set status = 0, reasonOf${obj.action} = ?, modFor${obj.action} = ? where ID = ${obj.id}`).run(obj.reason,obj.mod.id)    

    obj.guild.channels.cache.get(modLog).send({
        embed : new modEmbed(obj)
        .addField(`Mod responsible for punishment :`,`<@${dbObj.modID}> (${dbObj.modID})`)
        .addField(`Reason for punishment :`,dbObj.reason)
        .setTimestamp(dbObj.time)
    })

}