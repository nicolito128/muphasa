import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

export = class SayCommand extends Command {

	constructor(){
		super({
			name: 'say',
			desc: 'Obliga al Bot a decir algo.',
			usage: 'message',
			group: 'utils'
		})

	}

	run({message, targets}: RunArguments) {
		const msg: string = targets.join(' ').trim()
        if (!msg) {
        	message.channel.send('Debes ingresar un texto para que repita.')
        	return;
        }

        message.channel.send(msg)   
	}
}