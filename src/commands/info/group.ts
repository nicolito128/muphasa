import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import { Plugins } from './../../plugins'
import Config from './../../Config'

const prefix = Config.prefix;

export = class GroupCommand extends CommandContext {
	constructor(){
		super({
			name: 'group',
            alias: ['groups'],
            category: 'info'
		})
	}

	run({message, user, targets, guild}: Arguments) {
        const categories = Plugins.categories
        const embedInvalid = Embed.notify({
            title: 'Categorías de comandos',
            desc: `Consulta las lista de comandos usando **${prefix} group** *group name*\n\n \`${categories.join(' - ')}\``
        })
        const category = targets.join()

        if (!category) {
            message.channel.send(embedInvalid)
            return;
        }

        if (!categories.includes(category)) {
            message.channel.send('El grupo de comandos que intentas consultar no existe.')
            return;
        }

        const groupCommands: string[] = [...new Set<string>(Plugins.commands.map(cmd => cmd.config.category === category ? cmd.config.name : " "))]
        message.channel.send(
            Embed.notify({
                title: `Categoría: ${category}`,
                desc: [
                    `Consulta más información sobre un comando usando **${prefix} help** *command*`,
                    `\n ${groupCommands.join(' - ')}`
                ]
            })
        )
	}
}