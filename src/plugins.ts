import * as fs from 'fs'
import { Message, Guild, User, Collection, GuildMember, PermissionResolvable } from 'discord.js'
import { CommandContext, Arguments } from './lib/command'
import { App } from './client'
import Config from './Config'

type CooldownStruct<Userid, Timestamp> = Map<Userid, Timestamp>;

/**
	* PluginSystem:
	* 	The master Class of Plugins. It's responsible for managing everything
	* 	related to plugins (commands) loading them and providing extra functionalities.
*/
export class PluginSystem {
	readonly loader: PluginLoader;

	constructor() {
		this.loader = new PluginLoader();
	}

	get commands(): Collection<string, CommandContext> {
		return this.loader.commands;
	}

	get cooldowns(): Collection<string, CooldownStruct<string, number>> {
		return this.loader.cooldowns;
	}

	/** All the categories or lists in which the commands are classified. */
	get categories(): string[] {
		return [
			...new Set(
				this.commands.map(
					(cmd: CommandContext) => cmd.config.category ? cmd.config.category : 'basic')
				)
			] as string[]
	}

	getCommand(name: string): CommandContext | null {
		if (!this.hasCommand(name)) return null;

		return this.commands.find(
			(cmd: CommandContext) => cmd.config.name === name
		) || this.commands.find(
			(cmd: CommandContext) => (cmd.config.alias as string[]).includes(name)
		) as CommandContext;
	}

	hasCommand(name: string): boolean {
		if (this.commands.has(name)) return true;
		return false
	}

	clearCooldowns(): boolean {
		if (this.cooldowns.size <= 0) return false;

		this.cooldowns.clear();
		return true;
	}

	emitCommand(args: Arguments): void {
		const { message, user } = args;

		if (!this.getCommand(args.cmd)) return;
		const command: CommandContext = this.getCommand(args.cmd) as CommandContext;

		if (command.config.ownerOnly && message.author.id !== Config.owner) {
			message.channel.send('Sólo el propietario del Bot puede utilizar este comando.')
			return;
		}

		if (command.config.guildOnly && message.channel.type === 'dm') {
			message.channel.send('Este comando sólo está disponible en servidores de discord.')
			return;
		}

		// Sends an error when it is not possible to access the server information.
		if (
			message.channel.type === 'text' &&
			!message.guild?.available &&
			command.config.guildOnly
		) {
			message.channel.send('No es posible acceder a información del servidor para efectuar el comando.')
			return;
		}

		// If the bot doesn't have the permissions, it returns an error message.
		if (!this.hasPermission({command, message, args})) return;
		if (this.cooldownAlreadyExists({command, message, user})) {
			message.channel.send(`¡No tan rápido ${user}!`)
			message.channel.send(`Debes esperar **${command.config.cooldown} segundos** antes de poder volver a usar el comando \`${command.config.name}\``)
			return;
		}

		command.run(args)
	}

	hasPermission({command, message, args}: {
		command: CommandContext,
		message: Message,
		args: Arguments
	}): boolean {
		if (command.config.permissions != 'SEND_MESSAGES' && message.channel.type == 'text') {
			const bot: GuildMember | null = (args.guild as Guild).members.cache.find(member => member.user.bot && member.id === App.user!.id) || null;
			if (bot && !bot.hasPermission(command.config.permissions as PermissionResolvable)) {
				message.channel.send(`No puedo ejecutar ese comando. Me falta el permiso de \`${command.config.permissions}\``)
				return false;
			}
		}

		return true
	}

	/** 
	 * Creates a new cooldown for the command used by
	 * a user, and if any  cooldown has already
	 * expired, deletes it.
	*/
	cooldownAlreadyExists({command, message, user}: {
		command: CommandContext,
		message: Message,
		user: User
	}): boolean {
		if (
			command.config.cooldown &&
			command.config.cooldown > 0 && 
			this.cooldowns.has(command.config.name)
		) {
			const cooldown = this.cooldowns.get(command.config.name) as Map<string, number>;

			// If the user has previously used the command return an error message
			if (cooldown.has(user.id)) {
				const expiration: number = (command.config.cooldown * 1000) + (cooldown.get(user.id) as number)
				if (Date.now() < expiration) return true;
			}

			// Clear cooldown after a while
			App.setTimeout(() => cooldown.delete(user.id), command.config.cooldown * 1000);
			// Set the user timestamp
			cooldown.set(user.id, Date.now());
		}

		return false;
	}
}

/**
	* PluginLoader:
	* 	Load commands and set cooldowns.
*/
class PluginLoader {

	/** A collection to store and manage commands */
	readonly commands: Collection<string, CommandContext>;

	/** Manage commands cooldown */
	readonly cooldowns: Collection<string, CooldownStruct<string, number>>;

	constructor() {
		this.commands = new Collection<string, CommandContext>()
		this.cooldowns = new Collection<string, Map<string, number>>()
	}

	loadCommands(): void {
		fs.readdirSync('src/commands')
		.map(folder => {
			fs.readdirSync(`src/commands/${folder}`)
			.forEach(file => {
				// No-command file
				if (file.startsWith('_')) return;

				if (file.endsWith('.ts')) {
					const Command = require(`./commands/${folder}/${file.slice(0, -3)}`);
					this.loadCommand(this.checkCommandConfig(new Command()))
				}
			})
		})
	}

	loadCommand<Cmd extends CommandContext>(cmd: Cmd): void {
		if (!cmd || !cmd.config && !cmd.run) return;

		this.commands.set(cmd.config.name, cmd)
		console.log(`-> Command '${cmd.config.name}' loaded`)

		// If the command have a cooldown create It in the collection
		if (cmd.config.cooldown && !this.cooldowns.has(cmd.config.name)) {
			this.cooldowns.set(cmd.config.name, new Map<string, number>())
			console.log(`--> '${cmd.config.name}' cooldown created`)
		}
	}

	/**
		* 	Check the unassigned properties of config: CommandConfig
		* 	and give them a default value.
	*/
	checkCommandConfig<Cmd extends CommandContext>(cmd: Cmd): Cmd {
		if (cmd && cmd.config) {
			if (!cmd.config.desc) cmd.config.desc = ""
			if (!cmd.config.alias) cmd.config.alias = []
			if (!cmd.config.category) cmd.config.category = "utils"
			if (!cmd.config.usage) cmd.config.usage = ""
			if (!cmd.config.ownerOnly) cmd.config.ownerOnly = false
			if (!cmd.config.guildOnly) cmd.config.guildOnly = false
			if (!cmd.config.permissions) cmd.config.permissions = 'SEND_MESSAGES'
			if (!cmd.config.cooldown) cmd.config.cooldown = 0

			return cmd
		}

		return cmd
	}
}

export const Plugins = new PluginSystem();