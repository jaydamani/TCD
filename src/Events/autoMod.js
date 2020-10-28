const baseEvent = require("../registry/structures/baseEvent");
const cooldown = require('../registry/structures/cooldown')
const users = client.users.cache.keyArray()
const messageLimit = new cooldown(users,[{
    amount : 3, time : 100,
    execute : (messages,offender) => {
        console.log(420)
        messages.forEach(m => {

            if(!m.deleted){

                m.delete()
                m.deleted = true
            
            }
        
        })

    }
}])
/*const linkLimit = new cooldown(users,[{



},{

},{

},{

}])*/

module.exports =  new baseEvent('message',(message) => {
    
    messageLimit.add(message.author.id,message,message.member)

})