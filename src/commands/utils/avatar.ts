import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

export = class AvatarCommand extends Command {

	constructor(){
		super({
			name: 'avatar',
			desc: 'Muestra tu avatar o el de otro usuario.',
			usage: '@mention (optional)',
			alias: ['avy', 'viewavatar'],
			group: 'utils'
		})

	}

	run({message, user}: RunArguments) {
		const targetUser = message.mentions.users.first() || user;
        const avatar = targetUser.displayAvatarURL({dynamic: true, size: 1024, format: 'png' || 'gif'});
        const embed = Embed.notify({
        	title: '', 
            desc: [
                `[Avatar link](${avatar})`,
                `[Buscar en Google](https://www.google.com/searchbyimage?image_url=${avatar})`
            ]
        })
            .setImage(avatar)
            .setAuthor(`${targetUser.tag}'s avatar`, avatar);

        message.channel.send(embed)
	}
}