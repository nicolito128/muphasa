import { Client, ClientUser, ClientOptions} from 'discord.js'
import { Plugins, PluginSystem, MessageManager } from './plugins'
import Config from './Config'

export class CustomClient extends Client {
    readonly user: ClientUser | null;
    readonly startedAt: Date;
    plugins: PluginSystem;

    constructor(options: ClientOptions) {
        super(options)

        this.user = super.user;
        this.startedAt = new Date();
        this.plugins = Plugins;

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

    setPlugins(o: PluginSystem) {
        this.plugins = o;
    }

    connect() {
        console.log(`Login in progress...`)
        this.login(Config.token)

        console.log(`\n/***********************/`)
        console.log(` *  Login successfully! * `)
        console.log(`/***********************/\n`)
    }
}

export const App = new CustomClient({ restTimeOffset: 1000 })
