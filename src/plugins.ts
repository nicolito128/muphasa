'use strict';
import * as Discord from "discord.js"
import * as Config from "./../config/config.js"
import * as fs from "fs"

export interface IPlugins {
    commands: PluginCollection;
    helps: PluginCollection;

    evalMessage(message: Message): void;

    getCommand(message: Message): ICommandHandler;
    parseCommand(message: Message): ICommandParams;

    loadPlugins(): void;
    loadPlugin(plugin: CollectionReturnType): void;
    filterPlugin(plugin: CollectionReturnType): CollectionReturnType;
}

export interface ICommands {
    [c: string]: ICommandHandler
}

export interface IHelps {
    [h: string]: IHelpData
}

interface ICommandHandler {
    ({message, user, targets, cmd}: ICommandParams): any;
}

interface IHelpData {
    topic?: string;
    usage?: string;
    info: string | string[];
}

interface ICommandParams {
    message: Message;
    user: Discord.User;
    targets: string[];
    cmd: string | undefined;
}

export type Message = Discord.Message

type CollectionReturnType = ICommands | IHelps
type CollectionValueType = ICommandHandler | IHelpData

class PluginCollection extends Map {
    constructor() {
        super()
    }

    insert(key: string, value: CollectionValueType): void {
        this.set(key, value)
    }

    getAll(): CollectionReturnType {
        let data: CollectionReturnType = Object.create(null)
        this.forEach( (value: CollectionValueType, key: string) => {
            data[key] = value
        })
        console.log(data)

        return data
    }
}

class PluginsHandler implements IPlugins {
    commands: PluginCollection;
    helps: PluginCollection;

    constructor() {
        this.commands = new PluginCollection()
        this.helps = new PluginCollection()
    }

    evalMessage(message: Message): void {
        if (message.content.startsWith(Config.prefix)) {
            const params: ICommandParams = this.parseCommand(message)
            return this.getCommand(message)({...params})
        }
    }

    getCommand(message: Message): ICommandHandler {
        const {cmd} = this.parseCommand(message)
        return this.commands.get(cmd)
    }

    getHelps(): CollectionReturnType {
        return this.helps.getAll()
    }

    parseCommand(message: Message): ICommandParams {
        let user: Discord.User = (message.member as Discord.GuildMember).user
        let targets: string[] = message.content.slice(Config.prefix.length).trim().split(' ')
        let cmd: string | undefined = targets?.shift()?.toLowerCase()

        return {message, user, targets, cmd}
    }

    loadPlugins(): void {
        const files: string[] = fs.readdirSync('src/plugins/')
        const plugins: any[] = files.map((file: string) => {
            let plugin

            if (file.endsWith('.ts')) {
                plugin = require(`./plugins/${file.slice(0, -3)}`);
            } else if (file.endsWith('.js')) {
                plugin = require(`../src/plugins/${file}`);
            } else {
                return;
            }

            return plugin
        })

        plugins.forEach((plugin: any) => {
            this.loadPlugin(this.filterPlugin(plugin))
        })

        console.log(`Plugins loaded successfully!`)
    }

    loadPlugin(plugin: CollectionReturnType): void {
        let value: CollectionValueType
        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key: string) => {
                value = (plugin.commands as unknown as ICommands)[key] as ICommandHandler
                this.commands.insert(key, value)
            })
        }

        if (plugin.help) {
            Object.keys(plugin.helps).forEach((key: string) => {
                value = (plugin.helps as unknown as IHelps)[key] as IHelpData
                this.helps.insert(key, value)
            })
        }
        console.log(plugin)
    }

    filterPlugin(plugin: CollectionReturnType): CollectionReturnType {
        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key: string) => {
                if (typeof (plugin.commands as unknown as ICommands)[key] != 'function') {
                    delete (plugin.commands as unknown as ICommands)[key]
                }
            })
        }

        if (plugin.help) {
            Object.keys(plugin.helps).forEach((key: string) => {
                const pluginHelp = (plugin.help as unknown as IHelps)[key]

                // Check if the help is a string or an array
                if (typeof pluginHelp.info !== 'string')  {
                    // If this is false: remove the no-helper
                    if (!Array.isArray(pluginHelp.info)) delete (plugin.help as unknown as IHelps)[key]
                }
            })
        }

        return plugin
    }
}

export const Plugins: IPlugins = new PluginsHandler()