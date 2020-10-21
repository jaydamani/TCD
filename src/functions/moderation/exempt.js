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

module.exports = (obj = { mod, offender, reason, dbObj, action, guild},db) => {

    actionsList[obj.action.name](obj,db)

    db.prepare(`update ${obj.action.substring(2)}sTable set status = 0, reasonTo${obj.action.name} = ?, modFor${obj.action.name} = ? where offenderID = ${obj.offender.id}`).run()    

    obj.guild.channels.get(modLog).send({
        embed : new modEmbed(obj)
        .addField(`Mod responsible for punishment :`,obj.oldObj.mod)
        .addField(`Reason for punishment :`,obj.oldObj.reason)
        .setTimestamp(dbObj.time)
    })

}