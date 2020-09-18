import { Message, MessageCollector, CollectorFilter } from 'discord.js';

export const commands: Types.ICommands = {
	async imitate({message, user}): Promise<MessageCollector> {
		const filter: CollectorFilter = (m: Message): boolean => user.id !== Client.user.id;
        const collector: MessageCollector = new MessageCollector(message.channel, filter, { time: 60000 });
        await message.react('✅');
        return await collector.on('collect', async (m: any): Promise<void> => {
            try { await message.channel.send(`*${m.content}*`) } catch (e) { await message.channel.send('Algo ha salido mal.') }
  		})
	},

	impersonate({message, guild}) {
        const filter: CollectorFilter = (m: Message): boolean => m.author.id !== global.Client.user?.id
        const collector: MessageCollector = new MessageCollector(message.channel, filter, { time: 60000 })
        message.react('✅');
        return collector.on('collect', async (m: any): Promise<void> =>
        {
            try
            {
                m.content.replace(/[aeou]/, 'i');
                m.content.replace(/[áéóú]/, 'í');
                m.content.replace(/[AEOU]/, 'I');
                m.content.replace(/[ÁÉÓU]/, 'Í');
                await message.channel.send(`*${m.content}*`)
            }
            catch (e)
            {
                await message.channel.send('Algo ha salido mal.')
            }
        })
    },
}