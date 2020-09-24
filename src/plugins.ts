import * as fs from 'fs'
import * as Discord from 'discord.js'
import Config from './Config'
import { Client, CustomClient } from './client'

// Configuration required to create and use the commands.
interface CommandConfig {
	name: string;
	desc?: string;
	group?: string;
	usage?: string;
	alias?: string[];
	ownerOnly?: boolean;
	guildOnly?: boolean;
}

// An object for the run method in a command.
// Provides help to create a command.
export interface RunArguments {
	message: Discord.Message;
	user: Discord.User;
	client: CustomClient;
	guild: Discord.Guild | null;
	targets: string[];
	cmd: string | undefined;
}

// Every command inherits from Command.
export abstract class Command {
	readonly config: CommandConfig

	constructor(config: CommandConfig) {
		this.config = config
	}

	run({}: RunArguments): void | Promise<void> {}
}

/**
	* PluginSystem:
	* 	The master Class of Plugins. It's responsible for managing everything
	* 	related to plugins (commands) loading them and providing extra functionalities.
*/
export class PluginSystem {

	/**
		* A collection (extends to Map) to store and manage commands.
	*/
	private _commands: Discord.Collection<string, Command>

	constructor() {
		this._commands = new Discord.Collection<string, Command>()
	}

	get commands(): Discord.Collection<string, Command> {
		return this._commands
	}

	get groups(): string[] {
		return [...new Set(this._commands.map(cmd => cmd.config.group ? cmd.config.group : 'basic'))]
	}

	getCommand(name: string): Command | null {
		return this._commands.has(name) ? this._commands.get(name) as Command : null
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
		if (cmd.config.alias && cmd.config.alias.length >= 1) {
			cmd.config.alias.forEach(c => this._commands.set(c, cmd))
		}
		console.log(`-> Command '${cmd.config.name}' loaded`)
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

	eval(message: Discord.Message) {
		if (message.author.bot) return;

		if (message.content.toLowerCase().trim().startsWith(Config.prefix)) {
			const params = this.parseMessage(message)
			let command: Command | null = null;

			if (params.cmd) command = this.plugins.getCommand(params.cmd)
			if (command) {
				if (command.config.guildOnly && message.channel.type === 'dm') {
					message.channel.send('This command is only available on a Server.')
				}
				if (command.config.ownerOnly && message.author.id !== Config.owner) return;

				command.run({...params})
				return;
			}
		}
	}

	private parseMessage(message: Discord.Message): RunArguments {
		const user: Discord.User = message.author;
        const guild: Discord.Guild | null = (message.guild) ? message.guild : null;
        const targets: string[] = message.content.slice(Config.prefix.length).trim().split(' ');
        const cmd: string | undefined = targets?.shift().toLowerCase();
        const client = Client;

        return {message, client, user, guild, targets, cmd}
	}
}

export const Plugins = new PluginSystem()
export const Message = new MessageHandler(Plugins)