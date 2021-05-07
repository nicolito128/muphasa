import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

export = class PingCommand extends CommandContext {
	constructor(){
		super({
			name: 'ping',
			desc: 'Consulta los tiempos de respuesta del bot.',
			group: 'admin',
		})
	}

	run({message, client}: Arguments) {
        message.channel.send('**:ping_pong: Ping!**').then(msg => {
            msg.edit(Embed.notify({
                title: ':ping_pong: Pong!',
                desc: [
                `Latency: ${msg.createdTimestamp - message.createdTimestamp}ms`,
                `API Latency ${Math.round(client.ws.ping)}ms`
                ]
            }))
        })
	}
}