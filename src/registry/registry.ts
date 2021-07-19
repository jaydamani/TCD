import { CommandInteraction } from "../lib/structures/CommandInteraction"
import { MainClient } from "../lib/structures/client"
import { InteractionType } from "slash-commands"
import { Base } from '@structures/Base'
import * as fs from 'fs-extra'
import * as path from 'path'

async function register(dirPath : string, client : MainClient){
	
	await registerFiles(dirPath,client)
	
	//@ts-ignore api
	client.ws.on('INTERACTION_CREATE',(data : ApplicationCommandJSON) => {
		
		if(data.type != InteractionType.APPLICATION_COMMAND) return
		
		const interaction = new CommandInteraction(client,data)
		interaction.command.Base
		
	})
	
	//Event handling
	
	const events = client.events
	
	const temp = events.get('ready')
	client.once('ready',() => temp?.forEach(a => a.run(client)))
	
	//To avoid executing ready twice
	events.delete('ready')
	
	events.forEach((array,name) => {
		
		client.on(name,(...params : any[]) => {
			
			params.map(a => a.partial ? a.fetch() : a)
			array.forEach(a => a.run(...params))
			
		})
		
	})
	
	if(temp) events.set('ready',temp)
	
}

async function registerFiles(dir : string,client : MainClient){

	const files = await fs.readdir(dir, { withFileTypes : true} )

	for(const file of files){

		const p = path.join(dir,file.name)
		if(file.isDirectory()){

			if(file.name.endsWith('.cmd')) registerCommand(p,client)
			else registerFiles(p,client).catch(err => console.log(new Error(err)))
			continue

		}

		const a = require('../' + path.join(dir,file.name))

		Object.entries(a).filter((a) : a is [string,Base] => a[1] instanceof Base)
		.forEach(o => o[1].make(client))

	}

}

function registerCommand(dir : string,client : MainClient){

	const subs = fs.readdirSync(dir)


}

export { register }