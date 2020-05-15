'use strict';
import * as Discord from "discord.js"
import * as Config from "./../config/config.js"
import { Plugins } from "./plugins"

export interface IClient {
    // Methods
    ready(): void;

    setActivityMessage(msg: string): void

    handleErrors(): void;
    handleWarns(): void;
    handleDebug(): void;
    handleMessage(): void;

    connect(): void;
}

interface ICallback { (): void }

class CustomClient extends Discord.Client implements IClient {
    activity: string;

    constructor() {
        super()
        this.activity = `Prefix: ${Config.prefix}`
    }

    setActivityMessage(msg: string) {
        this.activity = msg
    }

    handleErrors(): void {
        this.on('error', e => new Error(`${e} \n`))
    }

    handleWarns(): void {
        this.on('warn', e => new Error(`WARN STATUS: ${e}\n`))
    }

    handleDebug(): void {
        this.on('debug', e => console.log(`DEBUG STATUS: ${e}\n`))
    }

    handleMessage(): void {
        this.on('message', async (message: Discord.Message) => {
            return await Plugins.evalMessage(message)
        })
    }

    ready(callback?: ICallback): void {
        this.on('ready', () => {
            (this.user as Discord.ClientUser).setActivity(this.activity, { type: 'WATCHING' })

            this.handleErrors()
            this.handleWarns()
            this.handleDebug()
            this.handleMessage()

            if (callback) callback.call(this)
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

export const Client: IClient = new CustomClient()