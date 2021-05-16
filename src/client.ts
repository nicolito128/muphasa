import { Client, ClientUser, ClientOptions} from 'discord.js'
import { Messager, MessageEvents } from './messager'
import { Plugins, PluginSystem } from './plugins'
import Config from './Config'

export class CustomClient extends Client {
    readonly user: ClientUser | null;
    readonly startedAt: Date;

    plugins: PluginSystem;
    messager: MessageEvents;

    constructor(
        plugins: PluginSystem,
        messager: MessageEvents,
        options: ClientOptions
    ) {
        super(options)
        this.user = super.user;
        this.startedAt = new Date();
        this.plugins = plugins;
        this.messager = messager;

        this.once("ready", () => {
            (this.user as ClientUser).setActivity(`Prefix: ${Config.prefix}`)
            this.on("disconnect", () => console.log(`The bot has been disconnected.`))
        })

        this.on('warn', (warn) => console.log(`WARN MESSAGE: ${warn}`))
        this.on('error', (err) => {
            throw new Error(`${err}\n`)
        })

        this.on('message', async (msg) => {
            await this.messager.eval(msg)
        })
    }

    setPlugins(system: PluginSystem): void {
        this.plugins = system;
        this.messager.plugins = system;
    }

    connect(): void {
        console.log(`Login in progress...`)
        this.login(Config.token)

        console.log(`\n/***********************/`)
        console.log(` *  Login successfully! * `)
        console.log(`/***********************/\n`)
    }
}

export const App = new CustomClient(Plugins, Messager, { restTimeOffset: 1000 })
