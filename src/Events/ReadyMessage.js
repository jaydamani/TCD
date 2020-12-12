let baseEvent = require ("../registry/structures/baseEvent")
const timeEngine = require('../registry/timeEngine')

module.exports = new baseEvent("ready",() => {

    timeEngine.run()
    console.log("ight, Imma start now")

})
