import { Embed } from "./../../lib/embed"
import { LanguageHandler } from"./../../lib/language"
import { Guilds, IGuildData } from "./../../lib/guilds"

const language = new LanguageHandler('settings')
const validLanguages: string[] = ['es', 'en']

export const commands: Types.ICommands = {
    lang: 'language',
    language({message, user, guild, targets}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('ADMINISTRATOR')) {
            if (!global.Config.owners.includes(user.id)) return message.channel.send(Embed.denied())
        }
        const id: string = guild.id
        language.setGuildId(id)

        const target: string  = targets.join(' ').toLowerCase().trim()
        if (!target) return message.channel.send(language.use('langNotExist'))
        if (!validLanguages.includes(target)) return message.channel.send(language.use('invalidLanguage'))
        const lang: 'en' | 'es' = target as 'en' | 'es'

        if ((Guilds.get(id) as IGuildData).language === lang) return message.channel.send(language.use('langInUse'))

        Guilds.set(id, {language: lang})
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