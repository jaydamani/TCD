const fs = require("fs")
const path = require("path")
const baseEvent = require("./structures/baseEvent")
const baseCommand = require("./structures/baseCommand")
let eventsMap = new Map()

async function register(dirPath,client,db){

	async function registerFiles(dir){

		const obj = { client, db }
		const files = await fs.promises.readdir(dir, { withFileTypes : true} )

		for(const file of files){

			if(file.isDirectory()){

				await registerFiles(path.join(dir,file.name))
				continue

			}

			if(file.name.endsWith('.js')){

				const fileObj =require("../../" + path.join(dir,file.name))
				
				if(fileObj.constructor == baseEvent){

					fileObj.obj = obj
					if(eventsMap.has(fileObj.name)) eventsMap.get(fileObj.name).push(fileObj)
					else eventsMap.set(fileObj.name,[fileObj])

				}
				else if(fileObj.constructor == baseCommand){

					fileObj.obj = obj
					client.commandMap.set(fileObj.name,fileObj)
					fileObj.alias.forEach(n => client.commandMap.set(n,fileObj))

				}

			}

		}

	}

	await registerFiles(dirPath)
	
	client.once('ready',() => {

		params.map(a => a.partial ? a.fetch() : a)
		eventArray[1].forEach(({ code, obj }) => code(...params, obj))

	})

	eventsMap.delete('ready')

	for(const eventArray of eventsMap){

		client.on(eventArray[0],(...params) =>{

			params.map(a => a.partial ? a.fetch() : a)
			eventArray[1].forEach(({ code, obj }) => code(...params, obj))

		})

	}

}

module.exports = register
