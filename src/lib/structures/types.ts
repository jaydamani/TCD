import { ClientOptions, GuildChannel, GuildMember, MessageOptions, Role, Snowflake, User } from "discord.js";
import { PathLike } from "fs-extra";
import { ApplicationCommandOption, ApplicationCommandInteractionData } from "slash-commands";
import { Paths } from "tsconfig-paths/lib/mapping-entry";
import { ApplicationCommand } from "./ApplicationCommand";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]

export type MainClientOptions = ClientOptions
& { publickey : string, dir? : string }

export type modAction = 'warn' | 'ban' | 'kick' | 'mute'
export type exemptAction = 'Unban' | 'Unmute'
export type moderationObject = { mod : GuildMember,
offender : GuildMember | User, reason : string
time? : time, id? : number }
export type time = { ms : number, string : string }

export type CommandInteractionJSON = {

    version : 1,
    type : 2,
    token : string,
    member : {

        user : {

            id : Snowflake

        }

    },
    id : Snowflake,
    guild_id : Snowflake,
    data : ApplicationCommandInteractionData,
    channel_id : Snowflake

}

type arr = [never,never,never,string,number,boolean,GuildMember,Role,GuildChannel]

export type CommandResolvable = Snowflake | ApplicationCommand
type commandOption = Omit<ApplicationCommandOption,'name' | 'options'>

export type CommandOption = {

    [name : string] : commandOption

}

export type resolveOptions<T extends CommandOption> = {
    [P in keyof T] : (arr[T[P]['type']]
     | (T[P]['required'] extends true ? never : null))
     & (T[P]['choices'] extends any[] ? ArrayElement<T[P]['choices']>['value'] : unknown)
}
export type resolvedObj = { subs : string[], values : resolveOptions<any> }

export type InteractionReplyOptions = MessageOptions & 
{ deleteInput? : boolean, privateMessage? : Boolean }
