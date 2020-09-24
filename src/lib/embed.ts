'use strict';
import * as Discord from "discord.js"

interface IEmbedOptions {
    [o: string]: any;
}

interface NotifyOptions {
    title: string;
    desc: string | string[];
    color?: Discord.ColorResolvable
}

function generateRandomHex(): string {
    const hexNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
    let random: number
    let hex: string = '#';

    for (let i = 0, l = hexNumbers.length; i < 6; i++) {
        random = Math.round(Math.random() * l)
        hex += hexNumbers[random]
    }

    return hex
}

export class CustomEmbed extends Discord.MessageEmbed {
    constructor(options: IEmbedOptions) {
        super(options)
    }

    create(options?: IEmbedOptions): CustomEmbed {
        return new CustomEmbed(options || {})
    }

    denied(permission?: string): CustomEmbed {
        return this.create()
            .setTitle('Acceso denegado')
            .setColor([213, 41, 32])
            .setDescription(`No tienes suficiente autoridad para usar este comando. ${permission ? 'Requiere: `' + permission + '`' : ''}`)
    }

    notify(options: NotifyOptions): CustomEmbed {
        if (!options.color) options.color = generateRandomHex()
        return this.create()
            .setTitle(options.title)
            .setColor(options.color)
            .setDescription(options.desc)
    }
}

export const Embed: CustomEmbed = new CustomEmbed({});