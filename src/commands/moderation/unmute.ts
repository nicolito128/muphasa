import { Guild, GuildMember } from 'discord.js'
import { CommandContext, Arguments } from './../../lib/command'
import { unmuteMember } from './_utils'
import { Embed } from './../../lib/embed'

export = class UnmuteCommand extends CommandContext {
    constructor() {
        super({
            name: 'unmute',
            desc: 'Si el miembro mencionado se encuentra silenciado devuelvele el permiso de escribir (remueve el rol "Muted").',
            usage: '@mention',
            category: 'moderation',
            guildOnly: true,
            permissions: 'MANAGE_ROLES'
        })
    }

    run({message, guild, client, targets}: Arguments) {
        const Guild = guild as Guild

        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send(Embed.denied('MANAGE_ROLES'))
            return;
        }

        if (message.mentions.members === null) {
            message.channel.send('Necesito que menciones a un usuario :person_frowning:')
            return;
        }
        
        const targetMember = message.mentions.members.first() as GuildMember
        const unmuteResult = unmuteMember(targetMember)

        if (!unmuteResult) {
            message.channel.send(`El miembro no estaba silenciado :speak_no_evil:`)
            return;
        }

        message.channel.send(`${targetMember.user} ya no estará silenciado :monkey_face:`)
    }
}
