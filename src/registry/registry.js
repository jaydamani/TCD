const fs = require("fs")
const path = require("path")
const baseEvent = require("./structures/baseEvent")
const baseCommand = require("./structures/baseCommand")

async function registerCommands(dir){

	const files = await fs.promises.readdir(dir,{withFileTypes : true})
	
	for(const file of files){

		if(file.isDirectory()){
			registerCommands(path.join(dir,file.name))
			continue
		}

		if(file.name.endsWith(".js")){

			const cmd = require("../../" + path.join(dir,file.name))

			if(cmd.constructor !== baseCommand) continue
			
			client.commandMap.set(cmd.name,cmd.code)
			cmd.alias.forEach(alias => client.commandMap.set(alias, cmd.code))

		}

	}

}

let eventsMap = new Map()

async function registerEvents(dirPath){

	async function registerFiles(dir){

		const files = await fs.promises.readdir(dir,{withFileTypes : true})
		
		for(const file of files){

			if(file.isDirectory()){
				await registerFiles(path.join(dir,file.name))
				continue
			}

			if(file.name.endsWith('.js')){

				let event = require("../../" + path.join(dir,file.name))
				if(event.constructor !== baseEvent) continue
				if(eventsMap.has(event.name)) eventsMap.get(event.name).push(event)
				else eventsMap.set(event.name,[event])
			
			}

		}

	}

	await registerFiles(dirPath)
	for(const eventArray of eventsMap){

		client.on(eventArray[0],(...params) =>{

			params.map(a => a.partial ? a.fetch() : a)
			eventArray[1].forEach(({ code }) => code(...params))
		
		111})
		
	}

}

module.exports = { registerEvents ,registerCommands }
