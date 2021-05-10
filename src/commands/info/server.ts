import { CommandContext, Arguments } from './../../lib/command'
import { Guild } from 'discord.js'
import { Embed } from './../../lib/embed'

export = class ServerCommand extends CommandContext {
	readonly regions: {[c: string]: string};

	constructor(){
		super({
			name: 'server',
			desc: 'Muestra información general sobre el servidor.',
			category: 'info',
			alias: ['serverinfo'],
			guildOnly: true
		})

		this.regions = {
    		"brazil": ":flag_br: Brazil",
    		"eu-central": ":flag_eu: Central Europe",
    		"singapore": ":flag_sg: Singapore",
    		"us-central": ":flag_us: U.S. Central",
    		"sydney": ":flag_au: Sydney",
    		"us-east": ":flag_us: U.S. East",
    		"us-south": ":flag_us: U.S. South",
    		"us-west": ":flag_us: U.S. West",
    		"eu-west": ":flag_eu: Western Europe",
    		"vip-us-east": ":flag_us: VIP U.S. East",
    		"london": ":flag_gb: London",
    		"amsterdam": ":flag_nl: Amsterdam",
    		"hongkong": ":flag_hk: Hong Kong",
    		"russia": ":flag_ru: Russia",
    		"southafrica": ":flag_za: South Africa"
		};
	}

	run({message}: Arguments) {
		const guild = message.guild as Guild;

		const status = {
            online: guild.presences.cache.filter(presence => presence.status === "online").size,
            idle: guild.presences.cache.filter(presence => presence.status === "idle").size,
            dnd: guild.presences.cache.filter(presence => presence.status === "dnd").size
        };

        const channels = {
            text: guild.channels.cache.filter(channel => channel.type === "text").size,
            voice: guild.channels.cache.filter(channel => channel.type === "voice").size
        };

        const bots = guild.members.cache.filter(member => member.user.bot).size
        const roles = guild.roles.cache.size
        const members = guild.memberCount
        const region = guild.region
        const verificationLevel = guild.verificationLevel

        const embedInfo = Embed.notify({title: '', desc: ''})
            .setAuthor(guild.name, guild.iconURL() || "")
            .setThumbnail(guild.iconURL() || "")
            .addField('Presences', `:green_circle: ${status.online} ㅤ:yellow_circle: ${status.idle} ㅤ:red_circle: ${status.dnd}`)
            .addField('Members', members, true)
            .addField('Bots', bots, true)
            .addField('Roles', roles, true)
            .addField('Channels', [`**Text**: ${channels.text}`, `**Voice**: ${channels.voice}`])
            .addField('Verification Level', verificationLevel.toUpperCase())
            .addField('Region', this.regions[region])
            .setFooter(`ID: ${guild.id} | Created: ${guild.createdAt.toUTCString()}`)

        message.channel.send(embedInfo)
	}
}