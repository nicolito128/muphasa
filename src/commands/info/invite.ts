import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

export = class InviteCommand extends CommandContext {
    readonly inviteURL: string;

	constructor(){
		super({
			name: 'invite',
			desc: 'Proporciona enlaces útiles para invitarme a tu servidor.',
			group: 'info'
		})

        this.inviteURL = 'https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=1543896183'
	}

	run({message, client}: Arguments) {
		const embed = Embed.notify({title: '¡Invitame a tu servidor!', desc: ''})
        .setDescription([
            '¡Hola! soy **' + client.user?.username + '**, un bot multi propocitos con diversas herramienta para mejorar tu servidor.',
            ' ',
            `:ok_hand: **[Invitación con permisos](${this.inviteURL})**`,
            `:pinching_hand: [Invitación sin permisos](https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=0)`
        ])
        .setColor('#4169E1')
        .setThumbnail(client.user?.avatarURL() || "")
        .addField('Funciono en', `${client.guilds.cache.size} servidores`, true)
        .addField('Ayudo a', `${client.users.cache.size} usuarios`, true)

        message.channel.send(embed)
	}
}