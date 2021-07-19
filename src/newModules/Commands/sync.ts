import { ApplicationCommand } from '@structures/ApplicationCommand'
import { ApplicationCommand as ApplicationCommandJSON } from 'slash-commands'
import { BaseCommand } from '@structures/commands/BaseCommand'
import { BaseEvent } from '@structures/BaseEvent'
import { MainClient } from '@structures/client'
import { Snowflake } from 'discord.js'


export class Event extends BaseEvent{

    name : BaseEvent.name = 'ready'
    description = 'Synchronizes command on discord side and here.'

    run : BaseEvent.ready = async client => {

        const a = func.bind(null, client);

        (await client.commands._fetch()).forEach(d => a(d))

        client.guilds.cache.forEach(async g =>
        (await client.commands._fetch(undefined,g.id))
        .forEach(d => a(d,g.id)))

        client.commands.unregistered.forEach(b => b.make(client))

    }

}

//creates application command
const func = (client : MainClient,data : ApplicationCommandJSON,guildId? : Snowflake) => {

    const command = client.commands.unregistered.get(data.name)

    if(command) new ApplicationCommand(client,data,command)
    else console
    .trace('Command exists on discord but not here.',{ data,guildId })

}