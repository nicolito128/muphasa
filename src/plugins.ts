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

    getHelps(): IHelps;
    getTopics(): string[];

    loadPlugins(): void;
    loadPlugin(plugin: IPluginStruct): void;
    filterPlugin(plugin: IPluginStruct): IPluginStruct;
}

export interface IPluginStruct {
    [p: string]: CollectionReturnType
}

export type Message = Discord.Message

// Helps
export interface IHelps {
    [h: string]: IHelpData
}

interface IHelpData {
    topic: string;
    usage?: string;
    info: string | string[];
}

// Commands
export interface ICommands {
    [c: string]: ICommandHandler
}

interface ICommandHandler {
    ({message, user, targets, cmd}: ICommandParams): any;
}

interface ICommandParams {
    message: Message;
    user: Discord.User;
    targets: string[];
    cmd: string | undefined;
}

// Collection
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

    getHelps(): IHelps {
        return this.helps.getAll() as IHelps
    }

    getTopics(): string[] {
        let topics: Set<string> = new Set()
        this.helps.forEach((value: any) => {
            topics.add(value.topic)
        })
        return [...topics]
    }

    parseCommand(message: Message): ICommandParams {
        let user: Discord.User = (message.member as Discord.GuildMember).user
        let targets: string[] = message.content.slice(Config.prefix.length).trim().split(' ')
        let cmd: string | undefined = targets?.shift()?.toLowerCase()

        return {message, user, targets, cmd}
    }

    loadPlugins(): void {
        const files: string[] = fs.readdirSync('src/plugins/')
        const plugins: IPluginStruct[] = files.map((file: string) => {
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

        plugins.forEach((plugin: IPluginStruct) => {
            this.loadPlugin(this.filterPlugin(plugin))
        })

        console.log(`Plugins loaded successfully!`)
    }

    loadPlugin(plugin: IPluginStruct): void {
        let value: CollectionValueType

        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key: string) => {
                value = plugin.commands[key]
                this.commands.insert(key, value)
            })
        }

        if (plugin.help) {
            Object.keys(plugin.help).forEach((key: string) => {
                value = plugin.help[key]
                this.helps.insert(key, value)
            })
        }
    }

    filterPlugin(plugin: IPluginStruct): IPluginStruct {
        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key: string) => {
                if (typeof plugin.commands[key] != 'function') {
                    delete plugin.commands[key]
                }
            })
        }

        if (plugin.help) {
            Object.keys(plugin.help).forEach((key: string) => {
                // Check if the help is a string or an array
                if (typeof (plugin.help as unknown as IHelps)[key].info != 'string')  {
                    // If this is false: remove the no-helper
                    if (!Array.isArray((plugin.help as unknown as IHelps)[key].info)) delete plugin.help[key]
                }
            })
        }

        return plugin
    }
}

export const Plugins: IPlugins = new PluginsHandler()