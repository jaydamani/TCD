import { arrIncludes, arrSome } from "@src/lib/Utils/Utils"
import { Base } from "@structures/Base"
import { Message, PermissionResolvable, Snowflake } from "discord.js"
import { ApplicationCommandOption, ApplicationCommandOptionType, PartialApplicationCommand } from "slash-commands"
import { MainClient } from "@structures/client"
import { CommandInteraction } from "../CommandInteraction"
import { 
    CommandOption, InteractionReplyOptions, resolveOptions 
} from "../types"

type func<T> = (options : resolveOptions<any>,
interaction : CommandInteraction | Message) => T

export module BaseCommand{
    export type run = func<void | InteractionReplyOptions | string>
}

export interface a{

    name : string,
    description : string

    requiredPerms? : PermissionResolvable[]
    requiredRoles? : Snowflake[]
    requiredToBe? : Snowflake[]
    bypassRoles? : Snowflake[]
    bypass? : Snowflake[]

    preRun? : func<Boolean>

}

interface command extends a{

    options? : CommandOption
    run : BaseCommand.run

}
interface commandGroup extends a{

    subcommands : {
        [n:string] : command
    }

}

export abstract class BaseCommand extends Base implements a{

    abstract options : CommandOption

    client? : MainClient
    guildID? : Snowflake

    requiredPerms? : PermissionResolvable[]
    requiredRoles? : Snowflake[]
    requiredToBe? : Snowflake[]
    bypassRoles? : Snowflake[]
    bypass? : Snowflake[]

    subs? : { [n:string] : command | commandGroup }

    preRun? : func<Boolean>

    run(){



    }

    make = (client : MainClient) => client.commands.create(this)

    handle(){

        

    }

    get ApplicationCommandJSON() : PartialApplicationCommand{

        let options : ApplicationCommandOption[] = []

        if(!(this.subs)) return a(this,this.name)

        for(const name in this.subs){

            const o = this.subs[name]
            if('run' in o) options.push({...a(o,name)})
            else{

                options.push({ name, description : o.description,
                type : 2,options : Object.entries(o.subcommands)
                .map(([name,o]) => a(o,name))}) 

            }

        }

        return { name : this.name, description : this.description,
        options }

    }

}

function check( option : resolveOptions<any>,interaction : CommandInteraction ,obj : a){

    const m = interaction.member
    const a = (id : string) => m.roles.cache.has(id)

    //arrSome and arrIncludes work just like
    //<Array>.some and <Array>.includes except
    //they return true even when array is empty/undefined

    //checks if they can bypass the perms
    return (arrIncludes(obj.bypass,m.id)
    || arrSome(obj.bypassRoles,a))
    || //checks if they have required roles
    (arrSome(obj.requiredRoles,a)
    && //this checks if they are the required person
    arrIncludes(obj.requiredToBe,m.id)
    &&/* this checks if they have required permissions
    note : it is using some which means any of given perm would do,
    so use nested arrays for && like behaviour */
    arrSome(obj.requiredPerms,p => m.permissions.has(p))
    && //and this is ofc checking preRun
    (!obj.preRun || obj.preRun(option,interaction)))

}

//this function would give the JSON for a subcommand
function a(cmd:command,n:string): ApplicationCommandOption {
    
    if(!cmd.options) return { 
        name : n, description : cmd.description, type : 1 
    }

    const options : ApplicationCommandOption[] = []

    for(const name in cmd.options){

        const o = cmd.options[name]
        options.push({ name, ...o })

    }

    return {
        name : n, description : cmd.description, 
        options, type : 1
    }

}