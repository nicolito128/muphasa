import * as Discord from 'discord.js'
import { Embed } from '../../lib/embed'

function createMuteRole(guild: Discord.Guild) {
    if (!guild.roles.cache.find(role => role.name === 'muphasa-mute')) {
        guild.roles.create({
            data: {
                name: 'muphasa-mute',
                mentionable: false,
                color: 'WHITE',
                hoist: false,
                permissions: [],
                position: 1
            }
        })
    }
}

function muteMemberAtAll(guild: Discord.Guild, member: Discord.GuildMember): boolean {
    const role = member.roles.cache.find(role => role.name === 'muphasa-mute')
    if (!role) {
        const guildRole = guild.roles.cache.find(role => role.name === 'muphasa-mute')
        if (guildRole) member.roles.add(guildRole)
    } else {
        return false
    }

    guild.channels.cache.forEach((channel) => {
        channel.createOverwrite(member, {
            'SEND_MESSAGES': false,
        })
    })

    return true
}

function unmuteMemberAtAll(guild: Discord.Guild, member: Discord.GuildMember): boolean {
    const role = member.roles.cache.find(role => role.name === 'muphasa-mute')
    if (role) {
        member.roles.remove(role)
    } else {
        return false
    }

    guild.channels.cache.forEach((channel) => {
        channel.updateOverwrite(member, {
            'SEND_MESSAGES': null,
        })
    })

    return true
}

export const commands: Types.ICommands = {
    async mute({message, user, guild}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(Embed.denied('MANAGE_ROLES'))
        if (!message.mentions.members?.first()) return message.channel.send('Necesito que menciones a un usuario para poder silenciarlo :person_frowning:')
        if (message.mentions.members.first() == message.member) return message.channel.send('No puedes silenciarte a ti mismo :no_entry_sign:')
        if (message.mentions.members?.first()?.id == global.Client.user?.id) return message.channel.send('No me silenciaré a mi mismo.')

        await createMuteRole(guild)

        const targetMember = message.mentions.members.first() as Discord.GuildMember
        if (targetMember && targetMember.hasPermission('MANAGE_ROLES')) return message.channel.send('¡No voy a silenciar a un compañero moderador! :pouting_cat:')

        const muteResult = await muteMemberAtAll(guild, targetMember)
        if (muteResult) {
            return message.channel.send(`¡La justicia prevalecerá! Muteaste a: ${targetMember?.user}`)
        }

        return message.channel.send(`El miembro ya estaba silenciado o no pudo ser silenciado por otra razón.`)
    },

    async unmute({message, user, guild}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(Embed.denied('MANAGE_ROLES'))
        if (!message.mentions.members?.first()) return message.channel.send('Necesito que menciones a un usuario :person_frowning:')

        await createMuteRole(guild)

        const targetMember = message.mentions.members.first() as Discord.GuildMember
        const unmuteResult = await unmuteMemberAtAll(guild, targetMember)
        
        if (unmuteResult) {
            return message.channel.send(`${targetMember.user} ya no estará silenciado :monkey_face:`)
        }

        return message.channel.send(`El miembro no estaba silenciado :speak_no_evil:`)
    }
}

export const help: Types.IHelps = {
    mute: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Remueve el permiso de escribir en todos los canales del miembro mencionado.'
    },

    unmute: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Si el miembro mencionado se encuentra silenciado: devuelvele el permiso de escribir en todos los canales.'
    }
}