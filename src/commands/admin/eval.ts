import { CommandContext, Arguments } from './../../lib/command'

export = class EvalCommand extends CommandContext {
	constructor() {
		super({
			name: 'eval',
			desc: 'Evalua código JavaScript y luego muestra el resultado.',
			category: 'admin',
			usage: 'code',
			alias: [],
			ownerOnly: true
		})
	}

	run({message, user, targets}: Arguments) {
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