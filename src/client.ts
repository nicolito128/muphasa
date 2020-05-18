'use strict';
import * as Discord from "discord.js"
import * as Config from "./../config/config.js"
import { Plugins } from "./plugins"

export class CustomClient extends Discord.Client {
    activity: string;
    user: Discord.ClientUser | null;

    constructor() {
        super()
        this.activity = `Prefix: ${Config.prefix}`
        this.user = super.user
    }

    setActivityMessage(msg: string) {
        this.activity = msg
    }

    handle(event: string, callback: (data: any) => any): void {
        this.on(event, callback)
    }

    ready(): void {
        this.handle('ready', () => {
            (this.user as Discord.ClientUser).setActivity(this.activity, { type: 'WATCHING' })

            this.handle('warn', (e: Error) => new Error(`WARN ${e} \n`))
            this.handle('error', (e: Error) => new Error(`${e} \n`))
            this.handle('debug', (status: any) => console.log(`DEBUG STATUS: ${status}`))
            this.handle('message', async (message: Discord.Message) => {
                return await Plugins.evalMessage(message)
            })
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