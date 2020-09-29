import { User } from 'discord.js'
import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import Searcher from './../../lib/giphy'

export = class HugCommand extends Command {
	readonly hugs: Searcher;
	readonly phrases: string[];

	constructor() {
		super({
			name: 'hug',
			desc: 'Abraza a un usuario mencionado.',
			usage: '@mention',
			group: 'actions',
			cooldown: 10
		})

		this.hugs = new Searcher({
			search: 'hug'
		})

		this.phrases = [
			':heart: ¡**$0** abrazó con mucho amor a **$1**!',
			':heart: **$0** está siendo apapachado por **$1**',
			':heart: ¡Cuidado, **$0**! ¡**$1** te sacará todo el aire con tanto amor!',
			':heart: **$0** abraza a **$1** con mucho cariño'
		]
	}

	async run({message, client, user}: RunArguments) {
		if (!message.mentions.users.first()) {
			message.channel.send('Necesito que menciones a un usuario.')
			return;
		}

		if (message.mentions.users.first()?.id === client.user?.id) {
			message.channel.send('¿Eh? ¿Así de solo estas?')
			return;
		}

		const targetUser = message.mentions.users.first() as User;
		const embed = Embed.notify({
			title: this.getRandomPhrase(targetUser.username, user.username),
			desc: ''
		})

		await this.hugs.getResponse().then(img => embed.setImage(img?.data.image_url || ""))

		message.channel.send(embed)
	}

	getRandomPhrase(first: string, second: string): string {
		const len = this.phrases.length;
		const random = Math.round(Math.random() * len)
		return this.phrases[random].replace(/\$0/g, first).replace(/\$1/g, second)
	}
}