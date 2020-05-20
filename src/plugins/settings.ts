import { Embed } from "./../../lib/embed"
import { LanguageHandler } from"./../../lib/language"
import { Database, IData } from "./../../lib/json-db"

const language = new LanguageHandler('settings')
const guilds = new Database('guilds')
const validLanguages: string[] = ['es', 'en']

export const commands: Types.ICommands = {
    async language({message, user, targets}) {
        if (message.member === null) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            if (!global.Config.owners.includes(user.id)) return message.channel.send(Embed.denied())
        }
        const id: string = message.member.guild.id
        language.setGuildId(id)

        const target: string  = targets.join(' ').toLowerCase().trim()
        if (!target) return message.channel.send(language.use('langNotExist'))
        if (!validLanguages.includes(target)) return message.channel.send(language.use('invalidLanguage'))
        const lang: 'en' | 'es' = target as 'en' | 'es'

        if ((guilds.get(id) as IData).language === lang) return message.channel.send(language.use('langInUse'))

        guilds.set({[id]: {language: lang}})
        message.channel.send(language.useByLang('setLanguage', lang))
    }
}

export const help: Types.IHelps = {
    language: {
        topic: 'settings',
        usage: 'en | es',
        info: 'Define el idioma que usará el bot para sus comandos'
    }
}