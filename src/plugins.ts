import * as fs from 'fs'
import * as Discord from 'discord.js'
import * as Config from './../config/config.js'
import { Guilds } from '../lib/guilds'

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
    [c: string]: ICommandHandler | string
}

interface ICommandParams {
    message: Message;
    user: Discord.User;
    targets: string[];
    guild: Discord.Guild | null;
    cmd: string | undefined;
}

type ICommandHandler = ({message, user, targets, guild, cmd}: ICommandParams) => any;

// Collection
type CollectionReturnType = ICommands | IHelps
type CollectionValueType = ICommandHandler | IHelpData

export class PluginCollection extends Map {
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

export class PluginsHandler {
    commands: PluginCollection;
    helps: PluginCollection;

    constructor() {
        this.commands = new PluginCollection()
        this.helps = new PluginCollection()
    }

    evalMessage(message: Message): void {
        let prefix: string = Config.prefix
        if (message.member) prefix = Guilds.getPrefix(message.member.guild.id)

        if (message.content.startsWith(prefix)) {
            const params: ICommandParams = this.parseCommand(message, prefix)
            let command: ICommandHandler | undefined

            if (params.cmd) command = this.getCommand(params.cmd)
            if (command) return command({...params})
        }
    }

    getCommand(cmd: string): ICommandHandler | undefined {
        return this.commands.get(cmd)
    }

    getHelp(help: string): IHelpData | undefined {
        return this.helps.get(help)
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

    parseCommand(message: Message, prefix: string): ICommandParams {
        let user: Discord.User = message.author
        let targets: string[] = message.content.slice(prefix.length).trim().split(' ')
        let cmd: string | undefined = targets?.shift()?.toLowerCase()
        let guild: Discord.Guild | null = (message.member) ? message.member.guild : null

        return {message, user, targets, guild, cmd}
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
                value = plugin.commands[key] as ICommandHandler
                this.commands.insert(key, value)
            })
        }

        if (plugin.help) {
            Object.keys(plugin.help).forEach((key: string) => {
                value = plugin.help[key] as IHelpData
                this.helps.insert(key, value)
            })
        }
    }

    filterPlugin(plugin: IPluginStruct): IPluginStruct {
        let commandAlias: string

        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key: string) => {
                if (typeof plugin.commands[key] != 'function') {
                    if (typeof plugin.commands[key] == 'string') {
                        commandAlias = plugin.commands[key] as string
                        if (plugin.commands.hasOwnProperty(commandAlias)) plugin.commands[key] = plugin.commands[commandAlias]
                    } else {
                        delete plugin.commands[key]
                    }
                }
            })
        }

        if (plugin.help) {
            Object.keys(plugin.help).forEach((key: string) => {
                // Check if the help is a string or an array
                if (typeof (plugin.help as IHelps)[key].info != 'string')  {
                    // If this is false: remove the no-helper
                    if (!Array.isArray((plugin.help as IHelps)[key].info)) delete plugin.help[key]
                }
            })
        }

        return plugin
    }
}

export const Plugins: PluginsHandler = new PluginsHandler()