let fs = require("fs")
let path = require("path")
let baseEvent = require("./structures/baseEvent")
let baseCommand = require("./structures/baseCommand")

async function registerCommands(dir,client){

	let files = await fs.promises.readdir(dir,{withFileTypes : true})
	
	for(let file of files){

		if(file.isDirectory()){
			registerCommands(path.join(dir,file.name),client)
			continue
		}

		if(file.name.endsWith(".js")){

			let cmd = require("../../" + path.join(dir,file.name))

			if(cmd.constructor !== baseCommand) continue
			
			client.commandMap.set(cmd.name,cmd.code)
			cmd.alias.forEach(alias => client.commandMap.set(alias, cmd.code))

		}

	}

}

let eventsMap = new Map()

async function registerEvents(dirPath,client){

	async function registerFiles(dir,client){

		let files = await fs.promises.readdir(dir,{withFileTypes : true})
		
		for(let file of files){

			if(file.isDirectory()){
				await registerFiles(path.join(dir,file.name),client)
				continue
			}

			if(file.name.endsWith('.js')){
				let event = require("../../" + path.join(dir,file.name))
				if(event.constructor !== baseEvent) continue
				if(eventsMap.has(event.name)) eventsMap.get(event.name).push(event.code)
				else eventsMap.set(event.name,[event.code])
			}

		}

	}

	await registerFiles(dirPath,client)
	for(let eventArray of eventsMap){

		client.on(eventArray[0],(...params) => eventArray[1].forEach(code => code(...params,client)))
		
	}

}

module.exports = { registerEvents ,registerCommands }
