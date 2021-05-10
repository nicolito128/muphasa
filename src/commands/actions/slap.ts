import { User } from 'discord.js'
import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import Searcher from './../../lib/giphy'

export = class HugCommand extends CommandContext {
	readonly slaps: Searcher;
	readonly phrases: string[];

	constructor() {
		super({
			name: 'slap',
			desc: 'Abofetea a un usuario.',
			usage: '@mention',
			category: 'actions',
			cooldown: 10
		})

		this.slaps = new Searcher({
			search: 'slap'
		})

		this.phrases = [
			'¡**$1** abofetea a **$0**!'
		]
	}

	async run({message, client, user}: Arguments) {
		if (!message.mentions.users.first()) {
			message.channel.send('Necesito que menciones a un usuario.')
			return;
		}

		if (message.mentions.users.first()?.id === client.user?.id) {
			message.channel.send('No pienso hacer eso.')
			return;
		}

		const targetUser = message.mentions.users.first() as User;
		const embed = Embed.notify({
			title: this.getRandomPhrase(targetUser.username, user.username),
			desc: ''
		})
		.setFooter('Impulsado por Giphy API', 'https://i.imgur.com/gLB2xaj.png')

		await this.slaps.getResponse().then(img => embed.setImage(img?.data.image_url || ""))
		message.channel.send(embed)
	}

	getRandomPhrase(first: string, second: string): string {
		const len = this.phrases.length;
		const random = Math.round(Math.random() * len)
		return this.phrases[random].replace(/\$0/g, first).replace(/\$1/g, second)
	}
}