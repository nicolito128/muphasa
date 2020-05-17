'use strict';
import * as Discord from "discord.js"

interface IEmbedOptions {
    [o: string]: any;
}

export class CustomEmbed extends Discord.MessageEmbed {
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

    notify(title: string, desc: string | string[], color?: Discord.ColorResolvable): CustomEmbed {
        if (!color) color = [57, 140, 232]
        return this.create()
            .setTitle(title)
            .setColor(color)
            .setDescription(desc)
    }
}

export const Embed: CustomEmbed = new CustomEmbed({});