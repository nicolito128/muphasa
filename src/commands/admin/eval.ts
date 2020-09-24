import Config from './../../Config'
import { Command, RunArguments } from './../../plugins'
import { Embed } from './../../lib/embed'

export = class EvalCommand extends Command {
	constructor() {
		super({
			name: 'eval',
			desc: 'Evalua código JavaScript y luego muestra el resultado.',
			group: 'admin',
			usage: 'code',
			ownerOnly: true
		})
	}

	run({message, user, targets}: RunArguments) {
        const code: string = targets.join(' ')
        if (!code) {
        	message.channel.send('Ingresa código que poder evaluar.')
        	return
        }

        try {
            message.channel.send(eval(code), {code: 'javascript'})
            console.log('\nEVAL OUTPUT:\n' + eval(code))
        } catch(err) {
            message.channel.send(`ERROR!\n${err}`, {code: 'javascript'})
        }
	}
}