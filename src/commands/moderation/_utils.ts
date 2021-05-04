import * as Discord from 'discord.js'

const muteName = 'Muted';

function createMutedRole(guild: Discord.Guild) {
    if (!guild.roles.cache.find(role => role.name === muteName)) {
        guild.roles.create({
            data: {
                name: muteName,
                mentionable: false,
                color: 'WHITE',
                hoist: false,
                permissions: [],
                position: 1
            }
        })
    }
}

export function muteMember(guild: Discord.Guild, member: Discord.GuildMember): boolean {
    createMutedRole(guild)

    const role = member.roles.cache.find(role => role.name === muteName)
    const guildRole = guild.roles.cache.find(role => role.name === muteName) as Discord.Role
    if (role) return false
    if (guildRole) member.roles.add(guildRole)

    guild.channels.cache.forEach((channel) => {
        if (!channel.permissionOverwrites.find(permission => permission.id === guildRole.id)) {
            channel.createOverwrite(guildRole, {
                'SEND_MESSAGES': false,
            })
        }
    })

    return true
}

export function unmuteMember(member: Discord.GuildMember): boolean {
    createMutedRole(member.guild)

    const role = member.roles.cache.find(role => role.name === muteName) as Discord.Role
    if (!role) return false
    member.roles.remove(role)
    return true
}