import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import { App } from './../../client'

export = class InviteCommand extends CommandContext {
	constructor(){
		super({
			name: 'invite',
			desc: 'Proporciona enlaces útiles para invitarme a tu servidor.',
			group: 'info'
		})
	}

	run({message}: Arguments) {
		const embed = Embed.notify({title: '¡Invitame a tu servidor!', desc: ''})
        .setDescription([
            '¡Hola! soy **' + App.user?.username + '**, un bot multi propocitos con diversas herramienta para mejorar tu servidor.',
            ' ',
            `:ok_hand: **[Invitación con permisos](https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=8)**`,
            `:pinching_hand: [Invitación sin permisos](https://discord.com/oauth2/authorize?client_id=551826544453222418&scope=bot&permissions=0)`
        ])
        .setColor('#4169E1')
        .setThumbnail(App.user?.avatarURL() || "")
        .addField('Funciono en', `${App.guilds.cache.size} servidores`, true)
        .addField('Ayudo a', `${App.users.cache.size} usuarios`, true)

        message.channel.send(embed)
	}
}