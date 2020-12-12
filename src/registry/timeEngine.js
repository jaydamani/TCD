const exempt = require("../functions/moderation/exempt")
const func = (dbObj,action,guild) => offender => {

    exempt({ offender, guild, action,
    reason : `Automated action by the bot`},dbObj)

}

module.exports = {
    run : () => setInterval(() => {
    
    const guild = client.guilds.cache.get("727853079029874740")
    const db = client.db

        //moderation stuff
        //mutes here

        const mutes = db.prepare(`select * from modsTable where status = 1 and action = 'mute' and strfTime('%s','now') > strfTime('%s',timeOfExemption)`).all()

        for (const mute of mutes) {
            
            guild.members.fetch(mute.offenderID).then(func(mute,'Unmute',guild))
            .catch(err => {
                
                if(err.message == 'Unknown Member') client.users.fetch(func(mute,'Unmute',guild))
                else throw err

            })

        }

        //handling bans here

        const bans = db.prepare(`select * from modsTable where status = 0 and action = 'ban' and strfTime('%s','now') > strfTime('%s',timeOfExemption)`).all()

        for (const ban of bans) {

            guild.fetchBan(ban.offenderID).then(func(ban,'Unban',guild))

        }

    },500)
}
