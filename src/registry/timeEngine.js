const exempt = require("../functions/moderation/exempt")
const func = (dbObj,action,guild) => offender => {

    exempt({ offender, guild, action,
    reason : `Automated action by the bot`},dbObj)

}

module.exports = {
    run : () => setInterval(() => {
    
    

    },500)
}
