import { MainClient } from '@structures/client';
import { PathLike } from 'fs-extra';
import { Paths } from 'tsconfig-paths/lib/mapping-entry';
import { register } from './registry/registry'

const bot = require("../config/bot")

const client = new MainClient({ 
	allowedMentions : { parse : ['users'] },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	publickey : '',dir : '@src/Modules'
})

//@ts-ignore
client.ws.on('INTERACTION_CREATE',console.trace)

register('src/newModules',client).then(() => {

	client.login(bot.token)

})
