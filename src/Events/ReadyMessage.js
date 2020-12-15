let baseEvent = require ("../registry/structures/baseEvent")

module.exports = new baseEvent("ready",() => {

    client.channels.cache.get('734686631675822151').send('logged in')
    console.log("ight, Imma start now")

})
