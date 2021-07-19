import { resolveOptions } from "@structures/types"
import { ApplicationCommandInteractionDataOption } from "slash-commands"

type obj = { subs : string[], values : resolveOptions<any> }

export function resolveOptions(options
: ApplicationCommandInteractionDataOption[] = [],
{ subs, values } : obj = { subs : [], values : {} }) : obj {

    if(options[0] && !options[0].value){

        subs.push(options[0].name)
        return resolveOptions(options[0].options,{ subs, values })

    }

    options.forEach(option => values[option.name] = option.value)
    return { subs, values }

}
