import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import { Client } from './../../client'

export = class GithubCommand extends Command {
	readonly url: string;

	constructor(){
		super({
			name: 'github',
			desc: 'Muestra el enlace al código fuente del Bot.',
			group: 'info'
		})

		this.url = 'https://github.com/nicolito128/muphasa'
	}

	run({message, user}: RunArguments) {
		message.channel.send(
            Embed.notify({
            	title: 'Github',
                desc: `¡Hola, ${user}! Soy **${Client.user?.username}**. Todavía me encuentro en fase de pruebas, ¡Pero no dudes en contar conmigo como tu BOT de confianza!`,
                color: [68, 197, 76]
            }).setURL(this.url)
        )
	}
}