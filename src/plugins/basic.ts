import { Embed, CustomEmbed } from '../../lib/embed'
import { toId } from '../../lib/text'

type RGB = {r: number, g: number, b: number}

const githubUrl: string = 'https://github.com/nicolito128/muphasa'

const regions: {[k: string]: string} = {
    "brazil": ":flag_br: Brazil",
    "eu-central": ":flag_eu: Central Europe",
    "singapore": ":flag_sg: Singapore",
    "us-central": ":flag_us: U.S. Central",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: U.S. East",
    "us-south": ":flag_us: U.S. South",
    "us-west": ":flag_us: U.S. West",
    "eu-west": ":flag_eu: Western Europe",
    "vip-us-east": ":flag_us: VIP U.S. East",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Russia",
    "southafrica": ":flag_za: South Africa"
}

const colorAliases: {[k: string]: string} = {
    "red": "C51818",
    "orange": "E7551B",
    "yellow": "E5D813",
    "gold": "ECA800",
    "green": "30D320",
    "lemongreen": "9AD91D",
    "lemonyellow": "D9D01D",
    "blue": "202BD3",
    "cian": "29D1BF",
    "skyblue": "76CEEC",
    "lightblue": "00D5EA",
    "purple": "641DD9",
    "violet": "A01DD9",
    "pink": "D320BD",
    "lightpink": "F9A0FB",
    "rose": "F9A0FB",
    "crimson": "D91D4D",
    "black": "000000",
    "night": "202020",
    "white": "FFFFFF",
    "gray": "B1B1B1",
    "brown": "441F10",
    "lightbrown": "8F4527"
}

const getHexValue = (n: number): string => Number(n).toString(16);

const rgbToHex = (r: number, g: number, b: number): string => getHexValue(r) + getHexValue(g) + getHexValue(b);

const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['0', '0', '0'];
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
};

export const commands: Types.ICommands = {
    eval({message, user, targets}) {
        if (!global.Config.owners.includes(user.id)) return message.channel.send( Embed.denied() )

        const code: string = targets.join(' ')
        if (!code) return message.channel.send('Ingresa código que poder evaluar.')

        try {
            message.channel.send(eval(code), {code: 'javascript'})
            console.log('\nEVAL OUTPUT:\n' + eval(code))
        } catch(err) {
            message.channel.send(`ERROR!\n${err}`, {code: 'javascript'})
        }
    },

    invitation: 'invite',
    invite({message}) {
        const embed = Embed.notify('¡Invitame a tu servidor!', '')
        .setDescription([
            '¡Hola! soy **' + global.Client.user?.username + '**, un bot multi propocitos con diversas herramienta para mejorar tu servidor.',
            ' ',
            `:ok_hand: **[Invitación con permisos](https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=8)**`,
            `:pinching_hand: [Invitación sin permisos](https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=0)`
        ])
        .setColor('#4169E1')
        .setThumbnail(global.Client.user?.avatarURL() || "")
        .addField('Funciono en', `${global.Client.guilds.cache.size} servidores`, true)
        .addField('Ayudo a', `${global.Client.users.cache.size} usuarios`, true)

        message.channel.send(embed)
    },

    serverinfo: 'server',
    server({message, guild}) {
        if (guild) {
            const status = {
                online: guild.presences.cache.filter(presence => presence.status === "online").size,
                idle: guild.presences.cache.filter(presence => presence.status === "idle").size,
                dnd: guild.presences.cache.filter(presence => presence.status === "dnd").size
            }
            const channels = {
                text: guild.channels.cache.filter(channel => channel.type === "text").size,
                voice: guild.channels.cache.filter(channel => channel.type === "voice").size
            }
            const bots = guild.members.cache.filter(member => member.user.bot).size
            const roles = guild.roles.cache.size
            const members = guild.memberCount
            const region = guild.region
            const verificationLevel = guild.verificationLevel

            const embedInfo = Embed.notify('', '')
            .setAuthor(guild.name, guild.iconURL() || "")
            .setThumbnail(guild.iconURL() || "")
            .addField('Presences', `:green_circle: ${status.online} ㅤ:yellow_circle: ${status.idle} ㅤ:red_circle: ${status.dnd}`)
            .addField('Members', members, true)
            .addField('Bots', bots, true)
            .addField('Roles', roles, true)
            .addField('Channels', [`**Text**: ${channels.text}`, `**Voice**: ${channels.voice}`])
            .addField('Verification Level', verificationLevel.toUpperCase())
            .addField('Region', regions[region])
            .setFooter(`ID: ${guild.id} | Created: ${guild.createdAt.toUTCString()}`)

            message.channel.send(embedInfo)
        }
    },

    ping({message}) {
        message.channel.send('**:ping_pong: Ping!**').then(msg => {
            msg.edit(Embed.notify(':ping_pong: Pong!', [
                `Latency: ${msg.createdTimestamp - message.createdTimestamp}ms`,
                `API Latency ${Math.round(global.Client.ws.ping)}ms`
            ]))
        })
    },

    lovee({message, guild}) {
        if (guild) {
            guild.members.cache.filter((member) => {
                if (member.user.username == 'Edna Moda' && member.user.bot) {
                    message.channel.send(`${member.user} tqm :heart:`)
                    message.delete()
                    return true
                }

                return false
            })
        }
    },

    help({message, targets, guild}) {
        if (!targets[0]) return message.channel.send('Ingresa un comando del cual quieras obtener información.')

        const target: string = targets.join()
        const help = global.Plugins.getHelp(target)
        let id: string = ""
        if (!help) return message.channel.send('No hay ayuda disponible sobre este comando o no existe.')
        if (guild) id = guild.id

        const embed = Embed.notify(target, [
            `**Topic**: ${help.topic}`,
            `**Usage**: \`${global.Config.prefix}${target}${(help.usage) ? ' < ' + help.usage + ' > ' : ''}\``,
            `**Info**: ${help.info}`
        ])

        message.channel.send(embed)
    },

    topics: 'topic',
    topic({message, targets, guild}) {
        const helps: Types.IHelps = global.Plugins.getHelps()
        const topicList: string[] = global.Plugins.getTopics()
        const prefix: string = global.Config.prefix
        const embedTopicInvalid: CustomEmbed = Embed.notify(
            'Listas de comandos',
            `Consulta las listas usando **${prefix}topic** *topic*`
        );
        topicList.forEach(topic => {
            embedTopicInvalid.addField(topic, 'ㅤ', true)
        })


        let topic: string = toId(targets.join())
        if (!topic) return message.channel.send(embedTopicInvalid)
        if (!topicList.includes(topic)) return message.channel.send(embedTopicInvalid)

        let topicData: string[] = []
        Object.keys(helps).forEach(key => {
            if (helps[key] && helps[key]?.topic === topic) {
                topicData.push('`' + prefix + key + '`')
            }
        })

        message.channel.send(
            Embed.notify(
                `Topic: ${topic}`,
                [
                    `Consulta más información sobre un comando usando **${prefix}help** *command*`,
                    ...topicData as string[]
                ]
            )
        )
    },

    say({message, targets}) {
        let msg: string = targets.join(' ').trim()
        if (!msg) return message.channel.send('Debes ingresar un texto para que repita.')
        return message.channel.send(msg)   
    },

    shadowsay: 'esay',
    esay({message, targets}) {
        let msg: string = targets.join(' ').trim()
        if (!msg) return message.channel.send('Debes ingresar un texto para que repita.')
        message.channel.send(msg)
        message.delete()
    },

    github({message, user}) {
        message.channel.send(
            Embed.notify(
                'Github',
                `¡Hola, ${user}! Soy **${global.Client.user?.username}**. Todavía me encuentro en fase de pruebas, ¡Pero no dudes en contar conmigo como tu BOT de confianza!`,
                [68, 197, 76] // rgb
                ).setURL(githubUrl)
        )
    },

    pick({message, targets}) {
        targets = targets.join(' ').split(',')
        if (targets.length <= 1) return message.channel.send('Intenta ingresar más elementos para seleccionar.')
        const len: number = targets.length
        const randomArgument: string = targets[Math.floor(Math.random() * len)]
        message.channel.send(
            Embed.notify('Random pick', `\`${randomArgument}\``)
        )
    },

    rand({message, targets}) {
        const num: number = parseInt(targets.join(' '))
        if (isNaN(num)) return message.channel.send('Este comando sólo admite un número como parametro.')
        if (num >= (100000 * 10000000)) return message.channel.send('No voy a calcular eso, lol')

        const randomNumber: number = Math.floor(Math.random() * (num + 1))
        message.channel.send(
            Embed.notify('Random number', `\`${randomNumber}\``)
        )
    },

    hex({message, targets, guild}) {
        let hex: string = '';
        let rgb: RGB = Object.create(null);
        let rgbInEmbed: string = '';
        let image: string = 'https://dummyimage.com/1000x1000/';

        if (!targets.length || !targets[0]) {
            message.channel.send(`No ingresaste ningún color para mostrar.`);
            return;
        }

        if (targets[0].includes('alias') || targets[0].includes('colors') || targets[0].includes('colorlist')) {
            const embed = Embed.notify('Color List', `\`${Object.keys(colorAliases).join(' - ')}\``);
            message.channel.send(embed);
            return;
        }

        const targetsParsed: number[] = targets.map(target => parseInt(target))

        if (targetsParsed.length > 1 && targetsParsed.length < 3) {
            message.channel.send(`Si ingresas un valor RGB debes pasar 3 parametros.`);
            return;
        } else if (targetsParsed.length == 3) {
            targetsParsed.forEach(target => {
                if (isNaN(target))
                {
                    message.channel.send('Si ingresas valores RGB todos los parametros deben ser números.');
                    return;
                }
            })

            hex = rgbToHex(targetsParsed[0], targetsParsed[1], targetsParsed[2]);
            rgbInEmbed = `${targetsParsed[0]} ${targetsParsed[1]} ${targetsParsed[2]}`;
        } else if (colorAliases.hasOwnProperty(toId(targets[0]))) {
            hex = colorAliases[targets[0]];
        } else {
            hex = targets[0].startsWith('#') ? targets[0].substring(1) : targets[0];
        }

        image += `${hex}/${hex}`;
        rgb = hexToRgb(hex.toString());
        if (!rgbInEmbed) rgbInEmbed = rgb ? rgb.r.toString() + ' ' + rgb.g.toString() + ' ' + rgb.b.toString() : 'NaN'

        const embed = Embed.notify('',
            [
                `\`HEX: #${hex}\``,
                `\`RGB: ${rgbInEmbed}\``
            ]
        )
        .setImage(image)
        .setColor(`#${hex}`);

        message.channel.send(embed);
    },

    avatar({message, user}) {
        const targetUser = message.mentions.users.first() || user;
        const avatar = targetUser.displayAvatarURL({dynamic: true, size: 1024, format: 'png' || 'gif'});
        const embed = Embed.notify('', 
            [
                `[Avatar link](${avatar})`,
                `[Buscar en Google](https://www.google.com/searchbyimage?image_url=${avatar})`
            ])
            .setImage(avatar)
            .setAuthor(`${targetUser.tag}'s avatar`, avatar);

        message.channel.send(embed)
    },
}

export const help: Types.IHelps = {
    server: {
        topic: 'basic',
        info: 'Muestra información general sobre el servidor.'
    },

    ping: {
        topic: 'basic',
        info: 'Consulta los tiempos de respuesta del bot.'
    },

    say: {
        topic: 'basic',
        usage: 'message',
        info: 'Obliga al BOT a enviar un mensaje en el canal actual.'
    },

    github: {
        topic: 'basic',
        info: 'Muestra el enlace al código fuente del BOT y datos sobre su desarrollo.'
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

    hex: {
        topic: "basic",
        usage: 'hex | colors | red blue green',
        info: 'Muestra una imagen completamente del color hex/rgb ingresado. También puedes consulta una lista de colores por defecto ingresando como parametro la palabra "colors".'
    },

    avatar: {
        topic: 'basic',
        usage: 'mention[optional]',
        info: 'Muestra tu avatar o el de otro usuario.'
    },

    eval: {
        topic: 'admin',
        usage: 'code',
        info: 'Evalua código JavaScript y luego muestra el resultado.'
    }
}