import { Arguments, CommandContext } from './../../lib/command'
import { Embed } from './../../lib/embed'

export = class GithubCommand extends CommandContext {
	readonly url: string;

	constructor(){
		super({
			name: 'github',
			desc: 'Muestra el enlace al código fuente del Bot.',
			category: 'info'
		})

		this.url = 'https://github.com/nicolito128/muphasa'
	}

	run({message, user, client}: Arguments) {
		message.channel.send(
            Embed.notify({
            	title: 'Github',
                desc: `¡Hola, ${user}! Soy **${client.user?.username}**. Todavía me encuentro en fase de pruebas, ¡Pero no dudes en contar conmigo como tu BOT de confianza!`,
                color: [68, 197, 76]
            }).setURL(this.url)
        )
	}
}