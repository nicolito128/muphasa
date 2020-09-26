import { Guild, GuildMember, ClientUser } from 'discord.js'
import { Command, RunArguments } from './../../lib/command'
import { muteMember } from './../../lib/moderation'
import { Embed } from './../../lib/embed'

export = class MuteCommand extends Command {
	constructor() {
		super({
			name: 'mute',
			desc: 'Remueve el permiso de escribir del miembro mencionado (el comando asigna el rol "Muted")',
			usage: '@mention',
			group: 'moderation',
			guildOnly: true,
			permissions: 'MANAGE_ROLES'
		})
	}

	run({message, guild, client, targets}: RunArguments) {
		const Guild = guild as Guild

        if (message.member && !message.member.hasPermission('MANAGE_ROLES')) {
        	message.channel.send(Embed.denied('MANAGE_ROLES'))
        	return;
        }

        if (message.mentions.members === null) {
        	message.channel.send('Necesito que menciones a un usuario para poder silenciarlo :person_frowning:')
        	return;
        }
        
        const targetMember = message.mentions.members.first() as GuildMember
        if (targetMember === message.member) {
        	message.channel.send('No puedes silenciarte a vos mismo :no_entry_sign:')
        	return;
        } else if (targetMember.user.id === (client.user as ClientUser).id) {
        	message.channel.send('No me silenciaré a mí mismo.')
        	return;
        } else if (targetMember.hasPermission('MANAGE_ROLES')) {
        	message.channel.send('¡No voy a silenciar a un compañero moderador! :pouting_cat:')
        	return;
        }

        const muteResult = muteMember(Guild, targetMember)
        if (!muteResult) {
        	message.channel.send(`El miembro ya estaba silenciado.`)
        	return;
        }

        message.channel.send(`¡La justicia prevalecerá! Silenciaste a ${targetMember.user}`)
	}
}
