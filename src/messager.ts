import { Message, Guild, User } from 'discord.js'
import { Arguments } from './lib/command'
import { Plugins, PluginSystem } from './plugins'
import { App } from './client'
import Config from './Config'

/**
	* MessageHandler:
	* 	Eval messages and provide responses.
*/
export class MessageEvents {
    private _plugins: PluginSystem;
    private settedPlugins: boolean;

    constructor() {
        this._plugins = Plugins;
        this.settedPlugins = false;
    }

    setPlugins(system: PluginSystem): void {
        this._plugins = system;
        this.settedPlugins = true;
    }

	eval(message: Message): void {
        if (!this.settedPlugins) {
            throw new Error("'plugins' must be configurated to work.")
        }

		if (message.author.bot) return;

		if (
			message.content
			.toLowerCase()
			.trim()
			.substring(0, Config.prefix.length) === Config.prefix
		) {
			const params = this.getRunArguments(message)
			this._plugins.emitCommand(params)
		}
	}

	private getRunArguments(message: Message): Arguments {
		const user: User = message.author;
        const guild: Guild | null = (message.guild) ? message.guild : null;
        const targets: string[] = message.content.slice(Config.prefix.length).trim().split(' ');
        const cmd: string = targets?.shift()?.toLowerCase() || "";
        const client = App;

        return {message, client, user, guild, targets, cmd}
	}
}

export const Messager = new MessageEvents();