'use strict';
import { Embed } from "../../lib/embed"
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

    topic({message, user, targets}) {
        const helps = global.Plugins.getHelps()
        const topicList = ['basic', 'admin']
        const embedTopicInvalid = Embed.notify(
            'Topics',
            `Lista de comandos a consultar: \`${topicList.join(' | ')}\``
        );
        let topic: string = targets[0]
        if (!topic) return message.channel.send(embedTopicInvalid)

        topic = targets[0].toLowerCase().trim()
        if (!topicList.includes(topic)) return message.channel.send(embedTopicInvalid)

        let topicData = Object.keys(helps)
            .map((key: string) => {
                if (helps[key].topic == topic) {
                    return '`' + global.Config.prefix + key + '`'
                }
            });

        message.channel.send(
            Embed.notify(
                `Topic: ${topic}`,
                topicData as string[]
            )
        )
    },

    say({message, targets}) {
        let msg: string = targets.join(' ').trim()
        if (!msg) return message.channel.send('Debes ingresar un texto para que repita.')
        return message.channel.send(msg)   
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

        const code: string = targets.join(' ')
        if (!code) return message.channel.send('Ingresa código que poder evaluar.')

        try {
            message.channel.send(eval(code), {code: 'javascript'})
            console.log('\nEVAL OUTPUT:\n' + eval(code))
        } catch(err) {
            message.channel.send(`ERROR!\n${err}`, {code: 'javascript'})
        }
    },

    pick({message, targets}) {
        targets = targets.join(' ').split(',')
        if (targets.length <= 1) return message.channel.send('Intenta ingresar más elementos para seleccionar.')
        const len: number = targets.length
        const randomArgument: string = targets[Math.round(Math.random() * (len - 0) + 0)]
        message.channel.send(
            Embed.notify('Random pick', `\`${randomArgument}\``)
        )
    },

    rand({message, targets}) {
        const num: number = parseInt(targets.join(' '))
        if (isNaN(num)) return message.channel.send('Este comando sólo admite un número como parametro.')
        if (num >= (100000 * 10000000)) return message.channel.send('No voy a calcular eso, lol')

        const randomNumber: number = Math.round(Math.random() * (num - 0) + 0)
        message.channel.send(
            Embed.notify('Random num', `\`${randomNumber}\``)
        )
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

    pick: {
        topic: 'basic',
        usage: 'element 1, element 2, element 3...',
        info: 'Selecciona un elemento aleatorio entre los proporcionados.'
    },

    rand: {
        topic: "basic",
        usage: 'number',
        info: 'Obten un número aleatorio entre 0 y el valor proporcionado.'
    },

    eval: {
        topic: 'admin',
        usage: 'code',
        info: 'Evalua código JavaScript y luego muestra el resultado.'
    },
}