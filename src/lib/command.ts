import { Message, User, Guild, PermissionResolvable } from 'discord.js'
import { CustomClient } from './../client'

// Configuration required to create and use the commands.
export interface CommandConfig {
	name: string;
	desc?: string;
	group?: string;
	usage?: string;
	alias?: string[];
	ownerOnly?: boolean;
	guildOnly?: boolean;
	cooldown?: number;
	permissions?: PermissionResolvable;
}

// An object for the run method in a command.
// Provides help to create a command.
export interface Arguments {
	message: Message;
	user: User;
	client: CustomClient;
	guild: Guild | null;
	targets: string[];
	cmd: string;
}

// Every command inherits from Command.
export abstract class CommandContext {
	readonly config: CommandConfig

	constructor(config: CommandConfig) {
		this.config = config
	}

	run({}: Arguments): void | Promise<void> {}
}