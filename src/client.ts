import * as Discord from 'discord.js'
import Config from './Config'
import { Plugins, PluginSystem, MessageManager } from './plugins'

export class CustomClient extends Discord.Client {
    readonly user: Discord.ClientUser | null;
    readonly plugins: PluginSystem;

    constructor(plugins: PluginSystem) {
        super({
            restTimeOffset: 1000
        })

        this.user = super.user
        this.plugins = plugins

        this.once("ready", () => {
            void (this.user as Discord.ClientUser).setActivity(`Prefix: ${Config.prefix}`)
            this.on("disconnect", () => console.log(`The bot has been disconnected.`))
        })

        this.on('warn', (warn) => console.log(`WARN MESSAGE: ${warn}`))
        this.on('debug', (status) => console.log(`DEBUG STATUS: ${status}`))
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

export const Client = new CustomClient(Plugins)