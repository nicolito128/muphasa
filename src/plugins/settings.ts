import { Embed } from "./../../lib/embed"
import { Database, IData } from "./../../lib/json-db"

type languages = 'en' | 'es'

const guilds = new Database('guilds')

export const commands: Types.ICommands = {
    language({message, user, targets}) {
        if (message.member === null) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            if (!global.Config.owners.includes(user.id)) return message.channel.send(Embed.denied())
        }

        const lang: languages | string = targets.join(' ').toLowerCase().trim()
        if (!lang) return message.channel.send('Debes especificar un idioma.')
        if (lang != 'en') {
            if (lang != 'es') {
                return message.channel.send('¡Idioma inválido! Sólo están disponibles: `en (English) | es (Español)`')
            }
        }

        const id: string = message.member.guild.id
        if ((guilds.get(id) as IData).language === lang) return message.channel.send('El idioma que intentas definir ya se está utilizando actualmente en el servidor')

        guilds.set({[id]: lang})
        message.channel.send(`¡\`${lang}\` definido correctamente como idioma del servidor!`)
    }
}

export const help: Types.IHelps = {
    language: {
        topic: 'settings',
        usage: 'en | es',
        info: 'Define el idioma que usará el bot para sus comandos'
    }
}