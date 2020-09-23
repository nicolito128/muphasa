import * as Discord from "discord.js"
import Config from "./Config"
import { Messages } from "./plugins"

export class CustomClient extends Discord.Client {
    activity: string;
    user: Discord.ClientUser | null;

    constructor() {
        super()
        this.activity = `Prefix: ${Config.prefix}`
        this.user = super.user
    }

    handleWarn() {
        this.on('warn', (warn: string) => console.log(`WARN MESSAGE: ${warn} \n`))
    }

    handleDebug() {
        this.on('debug', (status: string) => console.log(`DEBUG STATUS: ${status}`))
    }

    handleError() {
        this.on('error', (e: Error) => new Error(`${e} \n`))
    }

    handleMessage() {
        this.on('message', async (message: Discord.Message) => await Messages.eval(message))
    }

    ready(): void {
        this.on('ready', () => {
            (this.user as Discord.ClientUser).setActivity(this.activity, { type: 'WATCHING' })

            this.handleWarn()
            this.handleDebug()
            this.handleError()
            this.handleMessage()
        })
    }

    connect(): void {
        console.log(`Login in progress...`)

        try {
            this.ready()
            this.login(Config.token)

            console.log(`\n/***********************/`)
            console.log(` *  Login successfully! * `)
            console.log(`/***********************/\n`)
        } catch(err) {
            if (err) throw err
        }
    }
}

export const Client: CustomClient = new CustomClient()