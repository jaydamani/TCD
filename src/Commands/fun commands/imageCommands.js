const { createApi } = require('unsplash-js')
const fetch = require('node-fetch')
const { apis : { birch : accessKey} } = require('../../../config/bot.json')
const baseCommand = require('../../registry/structures/baseCommand')
const unsplash = createApi({
    accessKey,
    fetch
})
const photoCache = []
module.exports = new baseCommand('', config.imageCommands,(cmd,argz,message) => {

    unsplash.photos.getRandom({ query : cmd }).then(result => {
        
        if(!result.response) console.log(result)
        console.log(result.response.urls, result.response.links)
        message.channel.send(result.response?.links?.html ?? `no ${cmd} found`)
    
    })

})

// const getPhotos = () => {

//         console.log(result.response)
//         photoCache = result.response.filter(a => !a.tags.includdes(b => b.title == 'human')).map(a => a.links.html)
//         if(!photoCache.length) getPhotos()

//     })

// }
