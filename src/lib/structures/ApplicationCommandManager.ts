import { BaseManager,Snowflake } from "discord.js";
import { PartialApplicationCommand, ApplicationCommand as ApplicationCommandJSON } from 'slash-commands'
import { ApplicationCommand } from "./ApplicationCommand";
import { BaseCommand } from "./commands/BaseCommand";
import { MainClient } from "./client";
import { CommandResolvable } from "./types";

export class ApplicationCommandManager extends BaseManager<Snowflake,ApplicationCommand,CommandResolvable>{

  client : MainClient
  unregistered : Map<string,BaseCommand> = new Map()

	constructor(client : MainClient,iterable? : Iterable<ApplicationCommand>){

        super(client,<Iterable<any>>iterable,ApplicationCommand)
        this.client = client

    }

    //@ts-ignore api
    private route = this.client.api.applications('@me')

    async create(Base : BaseCommand,data : ApplicationCommandJSON ):
    Promise<BaseCommand | ApplicationCommand>{

        if(!this.client.readyAt){

            //It would be removed from map whenever
            //ApplicationCommand is created.
            this.unregistered.set(Base.name,Base)
            return Base

        }

        const command = Base.ApplicationCommandJSON

        const route = (Base.guildID
        ? this.route.guilds(Base.guildID) : this.route)
        .commands

        const m = await route.post(command)
        console.trace(m)

        return new ApplicationCommand(this.client,m,Base)

    }

    async deleteCommand(commandID : Snowflake, guildID? : Snowflake){

        const route = guildID
        ? this.route.guilds(guildID) : this.route
        const m = await route.commands(commandID).delete()

        this.cache.delete(commandID)
        console.trace(m)
        return m

    }

    _fetch() : Promise<ApplicationCommandJSON[]>
    _fetch(id : undefined,guildId : Snowflake)
    : Promise<ApplicationCommandJSON[]>
    _fetch(id : Snowflake,guildId? : Snowflake)
    : Promise<ApplicationCommandJSON>

    async _fetch(id? : Snowflake,guildId? : Snowflake) : Promise<ApplicationCommandJSON[] | ApplicationCommandJSON>{

        let route = this.route
        if(guildId) route = route.guilds(guildId)
        if(id) route = route = route.commands(id)

        return route.get()

    }

}