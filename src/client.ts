import { Plugins, PluginSystem, MessageManager } from './plugins'
import { Client, ClientUser, ClientOptions} from 'discord.js'
import Config from './Config'

export class CustomClient extends Client {
    readonly user: ClientUser | null;
    readonly plugins: PluginSystem;
    readonly startedAt: Date;

    constructor(plugins: PluginSystem, options: ClientOptions) {
        super(options)

        this.user = super.user;
        this.plugins = plugins;
        this.startedAt = new Date();

        this.once("ready", () => {
            void (this.user as ClientUser).setActivity(`Prefix: ${Config.prefix}`)
            this.on("disconnect", () => console.log(`The bot has been disconnected.`))
        })

        this.on('warn', (warn) => console.log(`WARN MESSAGE: ${warn}`))
        this.on('error', (err) => {
            throw new Error(`${err}\n`)
        })

        this.on('message', async (msg) => {
            await MessageManager.eval(msg)
        })
    }

    connect() {
        console.log(`Login in progress...`)
        this.login(Config.token)

        console.log(`\n/***********************/`)
        console.log(` *  Login successfully! * `)
        console.log(`/***********************/\n`)
    }
}

export const App = new CustomClient(Plugins, { restTimeOffset: 1000 })
