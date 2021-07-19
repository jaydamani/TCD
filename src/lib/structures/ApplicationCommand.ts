import { Base, Guild, Snowflake } from "discord.js";
import { ApplicationCommandOption, 
ApplicationCommand as ApplicationCommandJSON,
PartialApplicationCommand } from "slash-commands";
import { BaseCommand } from "./commands/BaseCommand";
import { MainClient } from "./client";

export class ApplicationCommand extends Base{

    id : Snowflake
    name : string
    description : string
    guild? : Guild
    options : ApplicationCommandOption[]
    guildID? : Snowflake
    applicationId : Snowflake
    private route : any
    client : MainClient
    Base : BaseCommand

    constructor(client : MainClient,data : ApplicationCommandJSON,Base : BaseCommand){

        super(client)

        this.client = client
        //@ts-ignore api shit
        let route = client.api.applications('@me')

        //removes it from unregistered and adds to the manager
        client.commands.unregistered.delete(Base.name)
        this.Base = Base
        client.commands.add(this)

        this.applicationId = data.application_id
        this.id = data.id

        this.name = data.name
        this.description = data.description
        this.options = data.options

        this.guildID = Base.guildID
        if(this.guildID){

            this.guild = client.guilds.cache.get(this.guildID)
            route = route.guild(this.guildID)

        }
        this.route = route.commands(this.id)
        this.client.commands.add(this)

    }

    private _patch(data : ApplicationCommandJSON) {

        this.name = this.Base.name = data.name
        this.description = this.Base.description = data.description

    }

    async edit(partialCommand: PartialApplicationCommand){

        const m = await this.route.patch({ data : partialCommand })
        console.trace(m)
        this._patch(m)
        return this

    }

    async delete(){

        await this.client.commands.deleteCommand(this.id,this.guildID)
        return this

    }

    async fetch(){

        const m = await this.route.get()
        this._patch(m)
        return this

    }

}
