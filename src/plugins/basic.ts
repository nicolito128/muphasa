'use strict';
import { Embed } from "./../../lib/embed"

const githubUrl: string = 'https://github.com/nicolito128/Muphasa-bot'

export const commands: Types.ICommands = {
    help({message, targets}) {
        const helps = global.Plugins.getHelps()

        if (!targets[0]) return message.channel.send('Ingresa un comando del cual quieras obtener información.')

        const target = targets[0].toLowerCase()
        if (!helps[target]) return message.channel.send('No hay ayuda disponible sobre este comando o no existe.')

        message.channel.send(
            Embed.notify(
                '',
                `\`${global.Config.prefix}${target}${(helps[target].usage) ? ' < ' + helps[target].usage + ' > ' : ''}\` ${helps[target].info}`
            )
        )
    },

    topic({message, targets}) {
        const helps = global.Plugins.getHelps()
        const topicList = ['basic', 'admin']
        const topic = targets[0].toLowerCase().trim()

        if (!topic || !topicList.includes(topic)) {
            return message.channel.send(
                Embed.notify(
                    'Topics',
                    `Lista de comandos a consultar: \`${topicList.join(' ')}\``
                )
            );
        }

        const topicData = Object.keys(helps).filter((key: string) => {
            if (helps[key].topic == topic) {
                return `\`${global.Config.prefix}${key}\``
            }
        })

        message.channel.send(
            Embed.notify(
                `Topic: ${topic}`,
                topicData
            )
        )
    },

    say({message, targets}) {
        return message.channel.send(targets.join(' '))   
    },

    github({message, user}) {
        message.channel.send(
            Embed.notify(
                'Github',
                `¡Hola, ${user}! Soy **${global.Client.user.name}**. Todavía me encuentro en fase de pruebas, ¡Pero no dudes en contar conmigo como tu BOT de confianza!`,
                [68, 197, 76] // rgb
                ).setURL(githubUrl)
        )
    },

    eval({message, targets}) {
        if (!global.Config.owners.includes(message.author.id)) return message.channel.send( Embed.denied() )

        const code = targets.join(' ')
        if (!code) return message.channel.send('Ingresa código que poder evaluar.')

        try {
            message.channel.send(eval(code), {code: 'javascript'})
            console.log('EVAL OUTPUT: ' + eval(code))
        } catch(err) {
            message.channel.send(`ERROR!\n${err}`, {code: 'javascript'})
            console.log('EVAL ERROR OUTPUT: ' + eval(code))
        }
    },
}

export const help: Types.IHelps = {
    say: {
        topic: 'basic',
        usage: 'message',
        info: 'Obliga al BOT a enviar un mensaje en el canal actual.'
    },

    github: {
        topic: 'basic',
        info: 'Muestra el enlace al código fuente del BOT y datos sobre el desarrollo.'
    },

    eval: {
        topic: 'admin',
        usage: 'code',
        info: 'Evalua código JavaScript y luego muestra el resultado.'
    },
}