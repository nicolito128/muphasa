import { Client, ClientUser, ClientOptions} from 'discord.js'
import { Messager, MessageEvents } from './messager'
import { Plugins, PluginSystem } from './plugins'
import Config from './Config'

export class CustomClient extends Client {
    readonly user: ClientUser | null;
    readonly startedAt: Date;

    messager: MessageEvents;
    plugins: PluginSystem;

    constructor(options: ClientOptions) {
        super(options)
        this.user = super.user;
        this.startedAt = new Date();
        this.plugins = Plugins;
        this.messager = Messager;

        this.once("ready", () => {
            void (this.user as ClientUser).setActivity(`Prefix: ${Config.prefix}`)
            this.on("disconnect", () => console.log(`The bot has been disconnected.`))
        })

        this.on('warn', (warn) => console.log(`WARN MESSAGE: ${warn}`))
        this.on('error', (err) => {
            throw new Error(`${err}\n`)
        })

        this.on('message', async (msg) => {
            this.messager.eval(msg)
        })
    }

    setPlugins(system: PluginSystem): void {
        this.plugins = system;
        this.messager.setPlugins(system);
    }

    connect(): void {
        console.log(`Login in progress...`)
        this.login(Config.token)

        console.log(`\n/***********************/`)
        console.log(` *  Login successfully! * `)
        console.log(`/***********************/\n`)
    }
}

export const App = new CustomClient({ restTimeOffset: 1000 })
