import { BaseEvent } from '@structures/BaseEvent'

new class Event extends BaseEvent{

    name : BaseEvent.name = 'ready'
    run : BaseEvent.ready = client => {

        console.log('hello mudar-fuker')
        client.users.cache.get('734686631675822151')
        ?.send('I swear I didn\'t do anything')

    }

}