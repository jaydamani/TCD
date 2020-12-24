const baseEvent = require("../../registry/structures/baseEvent")

module.exports = new baseEvent('rateLimit',(...b) => {

    const a = b.pop()

    console.log(b,a)
    client.users.cache.get(`429606655320391680`)?.send(JSON.stringify(a,null,3) + '\nratelimit message')

})
