import { CommandContext, Arguments } from './../../lib/command'
import { Plugins } from './../../plugins'
import { Embed } from './../../lib/embed'
import Config from './../../Config'

const prefix = Config.prefix;

export = class CategoryCommand extends CommandContext {
	constructor(){
		super({
			name: 'category',
            alias: ['categories']
		})
	}

	run({message, targets}: Arguments) {
        const categories = Plugins.categories
        const embedInvalid = Embed.notify({
            title: 'Categorías de comandos',
            desc: `Consulta las lista de comandos usando **${prefix} category** *category name*\n\n \`${categories.join(' - ')}\``
        })
        const category = targets.join()

        if (!category) {
            message.channel.send(embedInvalid)
            return;
        }

        if (!categories.includes(category)) {
            message.channel.send('La categoría que intentas consultar no existe.')
            return;
        }

        const categoryOfCommands: string[] = [
            ...new Set<string>(
                Plugins.commands.map(
                    cmd => cmd.config.category === category ? cmd.config.name : " "
                )
            )
        ];

        message.channel.send(
            Embed.notify({
                title: `Categoría: ${category}`,
                desc: [
                    `Consulta más información sobre un comando usando **${prefix} help** *command*`,
                    `\n ${categoryOfCommands.join(' - ')}`
                ]
            })
        )
	}
}