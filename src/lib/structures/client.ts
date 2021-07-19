import { Client, Collection } from "discord.js";
import { PathLike, readdirSync } from "fs-extra";
import { join } from "path";
import { ApplicationCommandManager } from "./ApplicationCommandManager";
import { Base } from "./Base";
import { BaseEvent } from "./BaseEvent";
import { MainClientOptions } from "./types";

export class MainClient extends Client{

    publicKey : string
    commands = new ApplicationCommandManager(this)
    events : Collection<BaseEvent.name,BaseEvent[]> = new Collection()

    constructor(options : MainClientOptions){

        super(options)
        this.publicKey = options.publickey

        if(options.dir) importFiles(options.dir,this)

    }

}

function importFiles(dir : string, client : MainClient){

    const files = readdirSync(dir,{ withFileTypes : true })

    for (const file of files) {

        const path = join(dir,file.name)

        if(file.isDirectory()){

            if(file.name.endsWith('.cmd')){}
            else importFiles(path,client)
            continue

        }

        const BaseClass = new (require(path))

        if(BaseClass?.prototype instanceof Base)
        (<Base> new BaseClass).make(client)
        else Object.values(BaseClass)
        .filter((b : any) : b is any => b?.prototype instanceof Base)
        .forEach(b => (<Base> new b).make(client))

    }

}

function registerCommand(path : string, client : MainClient){

    

}