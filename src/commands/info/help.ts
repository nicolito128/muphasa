import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import { Plugins } from './../../plugins'
import Config from './../../Config'

import Text from './../../lib/text'
const toId = Text.toId;

export = class HelpCommand extends CommandContext {
	constructor(){
		super({
			name: 'help',
			desc: 'Propicia información adicional sobre los comandos.',
			group: 'info'
		})
	}

	run({message, user, targets, guild}: Arguments) {
		if (!targets[0]) {
			message.channel.send('Ingresa un comando del cual quieras obtener información, u obten revisa la lista de comandos disponibles utilizando `' + Config.prefix +' groups`')
			return;
		}

        const target: string = toId(targets.join());
        const help = Plugins.commands.find(cmd => cmd.config.name == target)?.config;
        let id: string = "";

        if (!help) {
        	message.channel.send('No hay ayuda disponible sobre este comando o no existe.')
        	return;
        }

        if (guild) id = guild.id;

        const description = [
            `**Grupo**: ${help.group}`,
            `**Uso**: \`${Config.prefix} ${help.name}${(help.usage) ? ' < ' + help.usage + ' > ' : ''}\``,
        ];

        if (help.alias && help.alias.length >= 1) description.push(`**Alias**: ${help.alias.join(', ')}`);
        description.push(`**Descripción**: ${help.desc}`)

        const embed = Embed.notify({
        	title: target,
        	desc: description
        });

        message.channel.send(embed)
	}
}