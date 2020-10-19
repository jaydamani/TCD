const baseEvent = require("../registry/structures/baseEvent");

module.exports = new baseEvent('rateLimit',(...b) => {

    let a = b.pop()

    console.log(b)
    client.users.cache.get(`429606655320391680`).send(JSON.stringify(a))

})