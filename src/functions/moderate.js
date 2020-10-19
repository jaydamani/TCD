const modEmbed = require('../registry/structures/modEmbed')
const { mod : { muteRoleID },logs : { modLog }} = require('../../config/guild.json')
const baseFunction = require("../registry/structures/baseFunction");

const actionsList = {
    //warn is here in case something extra needs to be done. Like a warned role
    warn : ({ mod, offender, reason }) => {},
    ban : ({ mod, offender, reason, time, guild }) => {
    
        guild.members.ban(offender,{ reason })
    
        if(time){



        }
    
    },
    mute : ({ mod, offender, reason, time },db) => {

        if(offender.roles){

            offender.roles.add(muteRoleID,`muted by ${mod.displayName}(${mod.id}) for following reason : ${reason}`)

        }else{

            db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where memberID = ${offender.id} and roleIDs not like '${muteRoleID}'`).run()

        }

        if(time){



        }

    },
    kick : ({ mod, offender, reason, }) => {

        offender.kick(`kicked by ${mod.displayName}(${mod.id}) for following reason : ${reason}`)

    }

}

module.exports = async (obj = { mod : this.guild.me, offender, reason, time, action, guild }) => {

    let db = new require('better-sqlite3')('./modDB.db')
    let { lastInsertRowid } = db.prepare(`insert into ${obj.action.name}sTable (offenderID,modID,reason) values (?,?,?)`).run(obj.offender.id,obj.mod.id,obj.reason)

    actionsList[obj.action.name](obj,db)

    obj.id = lastInsertRowid
    obj.guild.channels.cache.get(modLog).send({ embed : new modEmbed(obj) })

}