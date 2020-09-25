import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import Config from './../../Config'

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
        	return;
        }

        try {
            message.channel.send(eval(code), {code: 'javascript'})
        } catch(err) {
            message.channel.send(`¡Ha sucedido un error!`)
            message.channel.send(err, {code: 'javascript'})
        }
	}
}