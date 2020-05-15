'use strict';
import * as Discord from "discord.js"

export interface IEmbed {
    create(options?: IEmbedOptions): CustomEmbed;
    denied(): CustomEmbed;
    notify(title: string, desc: string | string[], color: Discord.ColorResolvable): CustomEmbed;
}

interface IEmbedOptions {
    [o: string]: any;
}

class CustomEmbed extends Discord.MessageEmbed implements IEmbed {
    constructor(options: IEmbedOptions) {
        super(options)
    }

    create(options?: IEmbedOptions): CustomEmbed {
        return new CustomEmbed(options || {})
    }

    denied(): CustomEmbed {
        return this.create()
            .setTitle('Acceso denegado')
            .setColor([213, 41, 32])
            .setDescription(`No tienes suficiente autoridad para usar este comando.`)
    }

    notify(title: string, desc: string | string[], color: Discord.ColorResolvable = [57, 140, 232]): CustomEmbed {
        return this.create()
            .setTitle(title)
            .setColor(color)
            .setDescription(desc)
    }
}

export const Embed: CustomEmbed = new CustomEmbed({});