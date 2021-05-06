import { CommandContext, Arguments } from './../../lib/command'
import { Client } from './../../client'

export = class StartedAt extends CommandContext {
	constructor() {
		super({
			name: 'startedtat',
			desc: 'Devuelve la fecha y hora en la que se inició el bot.',
			group: 'admin',
			usage: 'code',
			alias: [],
			ownerOnly: true
		})
	}

	run({message, user, targets}: Arguments) {
        message.channel.send('Tiempo en el que empezó a funcionar mi sistema:')
		message.channel.send(Client.startedAt, {code: 'javascript'})
	}
}