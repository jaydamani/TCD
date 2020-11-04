const exempt = require("../functions/moderation/exempt")
const func = (dbObj,action,guild) => offender => {

    exempt({ offender, guild, action,
    reason : `Automated action by the bot`},dbObj)

}

module.exports = {
    run : () => setInterval(() => {
    
    let guild = client.guilds.cache.get("727853079029874740")
    let db = client.db

        //moderation stuff
        //mutes here

        let mutes = db.prepare(`select * from mutesTable where status = 1 and strfTime('%s','now') > strfTime('%s',timeOfUnmute)`).all()

        for (const mute of mutes) {
            
            guild.members.fetch(mute.offenderID).then(func(mute,'Unmute',guild))
            .catch(err => {
                
                if(err.message == 'Unknown Member') client.users.fetch(func(mute,'Unmute',guild))
                else throw err

            })

        }

        //handling bans here

        let bans = db.prepare(`select * from bansTable where status = 0 and strfTime('%s','now') > strfTime('%s',timeOfUnban)`).all()

        for (const ban of bans) {

            guild.fetchBan(ban.offenderID).then(func(ban,'Unban',guild))

        }

    },500)
}
