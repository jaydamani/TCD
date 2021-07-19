import { BaseEvent } from '@structures/BaseEvent'

new class Event extends BaseEvent{

    name : BaseEvent.name = 'rateLimit'
    run : BaseEvent.rateLimit = (a) => {

        console.log(a)
        this.client.users.cache.get('')?.send(JSON.stringify(a,null,2))

    }

}