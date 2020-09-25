import * as fs from 'fs'
import { Message, Guild, User, Collection } from 'discord.js'
import { Command, RunArguments } from './lib/command'
import { Client } from './client'
import Config from './Config'

/**
	* PluginSystem:
	* 	The master Class of Plugins. It's responsible for managing everything
	* 	related to plugins (commands) loading them and providing extra functionalities.
*/
export class PluginSystem {

	/**
		* A collection (extends Map) to store and manage commands.
	*/
	private _commands: Collection<string, Command>

	constructor() {
		this._commands = new Collection<string, Command>()
	}

	get commands(): Collection<string, Command> {
		return this._commands
	}

	get groups(): string[] {
		return [...new Set(this._commands.map((cmd: Command) => cmd.config.group ? cmd.config.group : 'basic'))] as string[]
	}

	getCommand(name: string): Command | null {
		return this._commands.find((cmd: Command) => cmd.config.name == name) || this._commands.find((cmd: Command) => cmd.config.alias?.includes(name)) || null;
	}

	loadCommands() {
		fs.readdirSync('src/commands')
		.map(folder => {
			fs.readdirSync(`src/commands/${folder}`)
			.forEach(file => {
				if (file.endsWith('.ts')) {
					const C = require(`./commands/${folder}/${file.slice(0, -3)}`);
					this.loadCommand(this.checkCommandConfig(new C()))
				}
			})
		})
	}

	loadCommand<Cmd extends Command>(cmd: Cmd) {
		if (!cmd || !cmd.config && !cmd.run) return;

		this._commands.set(cmd.config.name, cmd)
		console.log(`-> Command '${cmd.config.name}' loaded`)
	}

	emitCommand(params: RunArguments) {
		const { message } = params;
		let command: Command | null = null;

		if (params.cmd) command = this.getCommand(params.cmd)
		if (command) {
			if (command.config.ownerOnly && message.author.id !== Config.owner) return;
			if (command.config.guildOnly && message.channel.type === 'dm') {
				message.channel.send('Este comando sólo está disponible para un servidor de discord.')
				return;
			}

			command.run(params)
		}

	}

	/**
		* checkCommmandConfig:
		* 	Check the unassigned properties of config: CommandConfig
		* 	and give them a default value.
	*/
	private checkCommandConfig<Cmd extends Command>(cmd: Cmd): Cmd {
		if (cmd && cmd.config) {
			if (!cmd.config.desc) cmd.config.desc = ""
			if (!cmd.config.alias) cmd.config.alias = []
			if (!cmd.config.group) cmd.config.group = "utils"
			if (!cmd.config.usage) cmd.config.usage = ""
			if (!cmd.config.ownerOnly) cmd.config.ownerOnly = false
			if (!cmd.config.guildOnly) cmd.config.guildOnly = false
			if (!cmd.config.cooldown) cmd.config.cooldown = 0
			return cmd
		}

		return cmd
	}
}

/**
	* MessageHandler
	* 	Eval messages and provide responses.
*/
class MessageHandler {
	private plugins: PluginSystem;

	constructor(plugins: PluginSystem) {
		this.plugins = plugins
	}

	eval(message: Message) {
		if (message.author.bot) return;

		if (message.content.toLowerCase().trim().startsWith(Config.prefix)) {
			const params = this.getRunArguments(message)
			this.plugins.emitCommand(params)
		}
	}

	private getRunArguments(message: Message): RunArguments {
		const user: User = message.author;
        const guild: Guild | null = (message.guild) ? message.guild : null;
        const targets: string[] = message.content.slice(Config.prefix.length).trim().split(' ');
        const cmd: string = targets?.shift()?.toLowerCase() || "";
        const client = Client;

        return {message, client, user, guild, targets, cmd}
	}
}

export const Plugins = new PluginSystem()
export const MessageManager = new MessageHandler(Plugins)