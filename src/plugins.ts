import * as fs from 'fs'
import * as Discord from 'discord.js'
import * as Config from './../config/config.js'

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

export class PluginsLoader {
    private commands: PluginCollection;
    private helps: PluginCollection;

    constructor() {
        this.commands = new PluginCollection()
        this.helps = new PluginCollection()
    }

    getCommands() {
        return this.commands
    }

    getHelps() {
        return this.helps
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
        if (plugin.commands) {
            Object.keys(plugin.commands).forEach((key) => {
                switch (typeof plugin.commands[key]) {
                    case 'string':
                        let commandAlias = plugin.commands[key] as string
                        if (plugin.commands.hasOwnProperty(commandAlias)) plugin.commands[key] = plugin.commands[commandAlias];
                        break;
                    case 'function':
                        break;
                    default:
                        delete plugin.commands[key]
                }
            })
        }

        return plugin
    }
}

export class MessagesHandler {
    private plugins: PluginsHandler;

    constructor(plugins: PluginsHandler) {
        this.plugins = plugins
    }

    eval(message: Message): any {
        let prefix: string = Config.prefix

        if (message.content.toLowerCase().startsWith(prefix) || message.content.startsWith(prefix)) {
            if (message.author.bot) return null

            const params: ICommandParams = this.parseToCommand(message, prefix)
            let command: ICommandHandler | undefined

            if (params.cmd) command = this.plugins.getCommand(params.cmd)
            if (command) return command({...params})
        }
    }

    parseToCommand(message: Message, prefix: string): ICommandParams {
        let user: Discord.User = message.author
        let targets: string[] = message.content.slice(prefix.length).trim().split(' ')
        let cmd: string | undefined = targets?.shift()?.toLowerCase()
        let guild: Discord.Guild | null = (message.member) ? message.member.guild : null

        return {message, user, targets, guild, cmd}
    }
}

export class PluginsHandler {
    loader: PluginsLoader;

    constructor(loader: PluginsLoader) {
        this.loader = loader
    }
    
    getCommand(cmd: string): ICommandHandler | undefined {
        return this.loader.getCommands().get(cmd)
    }

    getHelp(help: string): IHelpData | undefined {
        return this.loader.getHelps()?.get(help)
    }

    getHelps(): IHelps {
        return this.loader.getHelps().getAll() as IHelps
    }

    getTopics(): string[] {
        let topics: Set<string> = new Set()
        this.loader.getHelps().forEach((value: any) => {
            topics.add(value.topic)
        })
        return [...topics]
    }
}

export const Plugins = new PluginsHandler(new PluginsLoader())
export const Messages = new MessagesHandler(Plugins)