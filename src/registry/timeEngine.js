const exempt = require("../functions/moderation/exempt")
const moderate = require("../functions/moderation/moderate")

module.exports = {
    run : () => setInterval(() => {

        let db = client.db
        let guild = client.guilds.cache.get(config.id)
        let func = (dbObj,action) => offender => {

            exempt({ offender, guild, action,
            reason : `Automated action by the bot`},dbObj)
        
        }

        //moderation stuff
        //mutes here

        let mutes = db.prepare(`select * from mutesTable where status = 0 and strfTime('%s','now') > strfTime('%s',timeOfUnmute)`).all()

        for (const mute of mutes) {
            
            guild.members.fetch(mute.offenderID).then(func(mute,'Unmute'))
            .catch(err => {
                
                if(err.message == 'Unknown Member') client.users.fetch(func(mute,'Unmute'))
                else throw err

            })

        }

        //handling bans here

        let bans = db.prepare(`select * from bansTable where status = 0 and strfTime('%s','now') > strfTime('%s',timeOfUnban)`).all()

        for (const ban of bans) {

            guild.fetchBan(ban.offenderID).then(func(ban,'Unban'))

        }

    },500)
}
