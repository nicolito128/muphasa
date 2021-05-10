import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

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
		const msg: string = targets.join(' ').trim()
        if (!msg) {
        	message.channel.send('Debes ingresar un texto para que repita.')
        	return;
        }

        message.channel.send(msg)   
	}
}