import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import { Plugins } from './../../plugins'
import Config from './../../Config'

const prefix = Config.prefix;

export = class GroupCommand extends Command {
	constructor(){
		super({
			name: 'group',
            alias: ['groups']
		})
	}

	run({message, user, targets, guild}: RunArguments) {
        const groupList = Plugins.groups
        const embedInvalid = Embed.notify({
            title: 'Categorías de comandos',
            desc: `Consulta las lista de comandos usando **${prefix} group** *group name*\n\n \`${groupList.join(' - ')}\``
        })
        const group = targets.join()

        if (!group) {
            message.channel.send(embedInvalid)
            return;
        }

        if (!groupList.includes(group)) {
            message.channel.send('El grupo de comandos que intentas consultar no existe.')
            return;
        }

        const groupCommands: string[] = [...new Set<string>(Plugins.commands.map(cmd => cmd.config.group === group ? cmd.config.name : " "))]
        message.channel.send(
            Embed.notify({
                title: `Group: ${group}`,
                desc: [
                    `Consulta más información sobre un comando usando **${prefix} help** *command*`,
                    `\n ${groupCommands.join(' - ')}`
                ]
            })
        )
	}
}