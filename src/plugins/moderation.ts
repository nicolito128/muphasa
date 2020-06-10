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

function muteMember(guild: Discord.Guild, member: Discord.GuildMember, channel?: Discord.GuildChannel): boolean {
    createMuteRole(guild)
    
    if (channel) {
        const permission = channel.permissionOverwrites.find(permission => permission.id === member.id)
        if (permission) return false

        channel.createOverwrite(member, {
            'SEND_MESSAGES': false,
        })
    } else {
        const role = member.roles.cache.find(role => role.name === 'muphasa-mute')
        const guildRole = guild.roles.cache.find(role => role.name === 'muphasa-mute') as Discord.Role
        if (role) return false
        if (guildRole) member.roles.add(guildRole)

        guild.channels.cache.forEach((channel) => {
            if (!channel.permissionOverwrites.find(permission => permission.id === guildRole.id)) {
                channel.createOverwrite(guildRole, {
                    'SEND_MESSAGES': false,
                })
            }
        })
    }
    
    return true
}

function unmuteMember(member: Discord.GuildMember, channel: Discord.GuildChannel): boolean {
    const role = member.roles.cache.find(role => role.name === 'muphasa-mute') as Discord.Role
    const permission = channel.permissionOverwrites.find(permission => permission.id === member.id)
    
    if (!role && !permission) return false
    if (role) member.roles.remove(role)
    if (permission) permission.delete()

    return true
}

export const commands: Types.ICommands = {
    mute({message, guild}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(Embed.denied('MANAGE_ROLES'))
        if (!message.mentions.members?.first()) return message.channel.send('Necesito que menciones a un usuario para poder silenciarlo :person_frowning:')
        if (message.mentions.members.first() == message.member) return message.channel.send('No puedes silenciarte a ti mismo :no_entry_sign:')
        if (message.mentions.members?.first()?.id == global.Client.user?.id) return message.channel.send('No me silenciaré a mi mismo.')

        const targetMember = message.mentions.members.first() as Discord.GuildMember
        if (targetMember && targetMember.hasPermission('MANAGE_ROLES')) return message.channel.send('¡No voy a silenciar a un compañero moderador! :pouting_cat:')

        const muteResult: boolean = muteMember(guild, targetMember)
        if (!muteResult) return message.channel.send(`El miembro ya estaba silenciado o no pudo ser silenciado por otra razón.`)
        
        message.channel.send(`¡La justicia prevalecerá! Silenciaste a ${targetMember?.user} en todos los canales posibles`)  
    },

    unmute({message, guild}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(Embed.denied('MANAGE_ROLES'))
        if (!message.mentions.members?.first()) return message.channel.send('Necesito que menciones a un usuario :person_frowning:')

        createMuteRole(guild)

        const targetMember = message.mentions.members.first() as Discord.GuildMember
        const unmuteResult: boolean = unmuteMember(targetMember, message.channel as Discord.GuildChannel)
        if (!unmuteResult) return message.channel.send(`El miembro no estaba silenciado :speak_no_evil:`)
        
        message.channel.send(`${targetMember.user} ya no estará silenciado :monkey_face:`)
    },

    mutehere({message, guild}) {
        if (!guild) return message.channel.send('Este comando sólo puede ser utilizado en un servidor.')
        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(Embed.denied('MANAGE_ROLES'))
        if (!message.mentions.members?.first()) return message.channel.send('Necesito que menciones a un usuario para poder silenciarlo :person_frowning:')
        if (message.mentions.members.first() == message.member) return message.channel.send('No puedes silenciarte a ti mismo :no_entry_sign:')
        if (message.mentions.members?.first()?.id == global.Client.user?.id) return message.channel.send('No me silenciaré a mi mismo.')

        const targetMember = message.mentions.members.first() as Discord.GuildMember
        if (targetMember && targetMember.hasPermission('MANAGE_ROLES')) return message.channel.send('¡No voy a silenciar a un compañero moderador! :pouting_cat:')

        const muteResult: boolean = muteMember(guild, targetMember, message.channel as Discord.GuildChannel)
        if (!muteResult) return message.channel.send(`El miembro ya estaba silenciado o no pudo ser silenciado por otra razón.`)

        return message.channel.send(`¡La justicia prevalecerá! Silenciaste a ${targetMember?.user} **en este canal**`)
    }
}

export const help: Types.IHelps = {
    mute: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Remueve el permiso de escribir del miembro mencionado (el comando asigna el rol "muphasa-mute").'
    },

    unmute: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Si el miembro mencionado se encuentra silenciado: devuelvele el permiso de escribir en todos (el comando remueve el rol "muphasa-mute").'
    },

    mutehere: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Remueve el permiso de escribir del miembro mencionado en el canal actual.'
    },

    unmutehere: {
        topic: 'moderation',
        usage: 'mention',
        info: 'Si el miembro mencionado se encuentra silenciado: devuelvele el permiso de escribir en este canal.'
    }
}