import { Message, Channel, GuildEmoji,
	Guild, User, GuildMember, Collection,
	Snowflake, Role, MessageReaction,
	RateLimitData, UserResolvable
} from "discord.js"
import { MainClient } from '@structures/client'
import { Base } from "./Base"

export abstract class BaseEvent extends Base{

	abstract name : BaseEvent.name
	abstract run(...params : any[]) : void

	make(client : MainClient){

		const arr = client.events.get(this.name)
		if(arr) arr.push(this)
		else{

			//note : ready event is registered in client constructor 
			//to hardcode certain things.
			client.events.set(this.name,[this])
			client.on(this.name,(...params : any[]) =>
			client.events.get(this.name)
			?.forEach(a => a.run(...params)))

		}

	}

}


//you gotta do what you gotta do

export module BaseEvent {

	export type name = 	'channelCreate' | 'channelDelete'
	| 'channelPinsUpdate'
	| 'channelUpdate'
	| 'debug' | 'warn'
	| 'disconnect'
	| 'emojiCreate' | 'emojiDelete'
	| 'emojiUpdate'
	| 'error'
	| 'guildBanAdd' | 'guildBanRemove'
	| 'guildCreate' | 'guildDelete' | 'guildUnavailable'
	| 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove'
	| 'guildMembersChunk'
	| 'guildMemberSpeaking'
	| 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate'
	| 'guildUpdate'
	| 'message' | 'messageDelete' | 'messageReactionRemoveAll'
	| 'messageDeleteBulk'
	| 'messageReactionAdd' | 'messageReactionRemove'
	| 'messageUpdate'
	| 'rateLimit'
	| 'ready'
	| 'roleCreate' | 'roleDelete'
	| 'roleUpdate'
	// | 'typingStart' | 'typingStop'
	// | 'userNoteUpdate'
	| 'userUpdate'

	export type run = BaseEvent.channelCreate | BaseEvent.channelDelete
	| BaseEvent.channelPinsUpdate
	| BaseEvent.channelUpdate
	| BaseEvent.debug | BaseEvent.warn
	| BaseEvent.disconnect
	| BaseEvent.emojiCreate | BaseEvent.emojiDelete
	| BaseEvent.emojiUpdate
	| BaseEvent.error
	| BaseEvent.guildBanAdd | BaseEvent.guildBanRemove
	| BaseEvent.guildCreate | BaseEvent.guildDelete | BaseEvent.guildUnavailable
	| BaseEvent.guildMemberAdd | BaseEvent.guildMemberAvailable | BaseEvent.guildMemberRemove
	| BaseEvent.guildMembersChunk
	| BaseEvent.guildMemberSpeaking
	| BaseEvent.guildMemberUpdate | BaseEvent.presenceUpdate | BaseEvent.voiceStateUpdate
	| BaseEvent.guildUpdate
	| BaseEvent.message | BaseEvent.messageDelete | BaseEvent.messageReactionRemoveAll
	| BaseEvent.messageDeleteBulk
	| BaseEvent.messageReactionAdd | BaseEvent.messageReactionRemove
	| BaseEvent.messageUpdate
	| BaseEvent.rateLimit
	| BaseEvent.ready
	| BaseEvent.roleCreate | BaseEvent.roleDelete
	| BaseEvent.roleUpdate
	| BaseEvent.typingStart | BaseEvent.typingStop
	| BaseEvent.userNoteUpdate
	| BaseEvent.userUpdate

	export type channelCreate = (channel: Channel) => void
	export type channelDelete = (channel: Channel) => void
	export type channelPinsUpdate = (channel: Channel, time: Date) => void
	export type channelUpdate = (oldChannel: Channel, newChannel: Channel) => void
	export type debug = (info: string) => void
	export type warn = (info: string) => void
	export type disconnect = (event: any) => void
	export type emojiCreate = (emoji: GuildEmoji) => void
	export type emojiDelete = (emoji: GuildEmoji) => void
	export type emojiUpdate = (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void
	export type error = (error: Error) => void
	export type guildBanAdd = (guild: Guild, user: User) => void
	export type guildBanRemove = (guild: Guild, user: User) => void
	export type guildCreate = (guild: Guild) => void
	export type guildDelete = (guild: Guild) => void
	export type guildUnavailable = (guild: Guild) => void
	export type guildMemberAdd = (member: GuildMember) => void
	export type guildMemberAvailable = (member: GuildMember) => void
	export type guildMemberRemove = (member: GuildMember) => void
	export type guildMembersChunk = (members: Collection<Snowflake, GuildMember>, guild: Guild) => void
	export type guildMemberSpeaking = (member: GuildMember, speaking: boolean) => void
	export type guildMemberUpdate = (oldMember: GuildMember, newMember: GuildMember) => void
	export type presenceUpdate = (oldMember: GuildMember, newMember: GuildMember) => void
	export type voiceStateUpdate = (oldMember: GuildMember, newMember: GuildMember) => void
	export type guildUpdate = (oldGuild: Guild, newGuild: Guild) => void
	export type message = (message: Message) => void
	export type messageDelete = (message: Message) => void
	export type messageReactionRemoveAll = (message: Message) => void
	export type messageDeleteBulk = (messages: Collection<Snowflake, Message>) => void
	export type messageReactionAdd = (messageReaction: MessageReaction, user: User) => void
	export type messageReactionRemove = (messageReaction: MessageReaction, user: User) => void
	export type messageUpdate = (oldMessage: Message, newMessage: Message) => void
	export type rateLimit = (rateLimitData: RateLimitData) => void
	export type ready = (client : MainClient) => void
	export type roleCreate = (role: Role) => void
	export type roleDelete = (role: Role) => void
	export type roleUpdate = (oldRole: Role, newRole: Role) => void
	export type typingStart = (channel: Channel, user: User) => void
	export type typingStop = (channel: Channel, user: User) => void
	export type userNoteUpdate = (user: UserResolvable, oldNote: string, newNote: string) => void
	export type userUpdate = (oldUser: User, newUser: User) => void
}