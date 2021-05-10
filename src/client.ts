import { Client, ClientUser, ClientOptions} from 'discord.js'
import { PluginSystem, MessageManager } from './plugins'
import Config from './Config'

export class CustomClient extends Client {
    readonly user: ClientUser | null;
    readonly startedAt: Date;

    constructor(options: ClientOptions) {
        super(options)

        this.user = super.user;
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

    set plugins(o: PluginSystem) {
        this.plugins = o;
    }

    get plugins(): PluginSystem {
        return this.plugins;
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
