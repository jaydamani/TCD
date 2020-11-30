const modEmbed = require('../../registry/structures/modEmbed')
const { mod : { muteRoleID },logs : { modLog }} = config

const actionsList = {
    //warn is here in case something extra needs to be done. Like a warned role or probably some sort of cooldown
    warn : ({ mod, offender, reason }) => {},
    ban : ({ mod, offender, reason, time, guild }) => {
    
        guild.members.ban(offender,{ reason : `banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time.string}.`})
    
    },
    mute : ({ mod, offender, reason, time },db) => {

        if(offender.roles){

            offender.roles.add(muteRoleID,`muted by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time.string}.`)

        }else{

            db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where memberID = ${offender.id}`).run()

        }

    },
    kick : ({ mod, offender, reason, }) => {

        offender.kick(`banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'.`)

    }

}

module.exports = async (obj = { mod , offender, reason, time, action, guild },db = new require('better-sqlite3')('./ModDB.db')) => {

    obj.mod = obj.mod || obj.guild.me
    actionsList[obj.action](obj,db)

    let message = await obj.guild.channels.cache.get(modLog).send(obj.offender.id)

    let { lastInsertRowid } = db.prepare(`insert into modsTable (offenderID,modID,reason,action,logID,timeOfExemption) values (?,?,?,?,?,?)`).run(obj.offender.id,obj.mod.id,obj.reason,obj.action,message.id,obj.time.obj?.toISOString())

    obj.id = lastInsertRowid
    message.edit(offender.id,new modEmbed(obj))

}