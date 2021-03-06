import { CommandContext, Arguments } from './../../lib/command'

export = class SayCommand extends CommandContext {

	constructor(){
		super({
			name: 'say',
			desc: 'Obliga al Bot a decir algo.',
			usage: 'message',
			category: 'utils'
		})

	}

	run({message, targets}: Arguments) {
		const existEveryoneMention: boolean = message.mentions.everyone;
		if (existEveryoneMention) {
			message.channel.send('No está permitido mencionar los roles de `here` o `everyone` con este comando.')
			return;
		}

		const msg: string = targets.join(' ').trim()
        if (!msg) {
        	message.channel.send('Debes ingresar un texto para que repita.')
        	return;
        }

        message.channel.send(msg)   
	}
}