import { APIMessage, Base, Guild, GuildMember, MessageAdditions, Snowflake, SnowflakeUtil, TextChannel } from "discord.js";
import { ApplicationCommandInteractionDataOption, ApplicationCommandOption, Interaction, InteractionResponseType } from "slash-commands";
import { ApplicationCommand } from "./ApplicationCommand";
import { MainClient } from "./client";
import { CommandInteractionJSON, InteractionReplyOptions } from "./types";

export class CommandInteraction extends Base{

    client : MainClient
    guild : Guild
    channel : TextChannel
    member : GuildMember
    id : Snowflake
    command : ApplicationCommand
    options? : ApplicationCommandInteractionDataOption[]
    createdAt : Date
    private token : string
    private previouslyResponded : Boolean = true
    private timeOut : number

    constructor(client : MainClient ,data : CommandInteractionJSON){

        super(client)

        this.client = client
        const g = client.guilds.cache.get(data.guild_id)
        if(!(g instanceof Guild))
        throw new Error('Received an application command from unknown Guild')
        this.guild = g
        this.channel = this.guild.channels.cache
        .get(data.channel_id) as TextChannel
        this.member = this.guild.members.cache.get(data.member.user.id)
        ?? new GuildMember(client,data.member,this.guild)

        this.id = data.id
        this.createdAt = SnowflakeUtil.deconstruct(this.id).date
        
        this.command = client.commands.cache.get(data.data.id)!
        this.options = data.data.options
        this.token = data.token
        this.timeOut = setTimeout(this.acknowledge,60000)

    }

    private get route(){

        if(!this.client.user) return false
        //@ts-ignore api
        const r : any = this.client.api
        return this.previouslyResponded
        ? r.interactions(this.id,this.token).callback
        : r.webhooks(this.client.user.id,this.token).messages

    }

    private _reply = async (data : any) => {

        const a = await this.route.post(data)
        if(!this.previouslyResponded){

            this.previouslyResponded = true
            clearTimeout(this.timeOut)

        }
        return a

    }

    async reply(content : string | MessageAdditions,options : InteractionReplyOptions = {} ){

        const transformed = APIMessage
        .transformOptions(content,options,undefined,true) as InteractionReplyOptions
        const apiMessage = await new APIMessage(this.channel,transformed)
        .resolveData().resolveFiles()

        const type = 3 + +Boolean(transformed.deleteInput)
        const flags = transformed.privateMessage ? 64 : undefined

        return this._reply({ data : {

            type,
            data : { ...apiMessage.data, flags },
            files : apiMessage.files

        }})

    }

    acknowledge(deleteInput : Boolean = false) : Promise<any> | false{

        if(!this.previouslyResponded) return this._reply({ data : { type : 2 + +deleteInput*3 }})
        else return false

    }

}
