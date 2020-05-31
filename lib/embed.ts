'use strict';
import * as Discord from "discord.js"

interface IEmbedOptions {
    [o: string]: any;
}

function generateRandomHex(): string {
    const hexNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
    let random: number
    let hex: string = '#';

    for (let i = 0, l = hexNumbers.length; i < 6; i++) {
        random = Math.round(Math.random() * (l - 1))
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

    denied(): CustomEmbed {
        return this.create()
            .setTitle('Acceso denegado')
            .setColor([213, 41, 32])
            .setDescription(`No tienes suficiente autoridad para usar este comando.`)
    }

    notify(title: string, desc: string | string[], color?: Discord.ColorResolvable): CustomEmbed {
        if (!color) color = generateRandomHex()
        return this.create()
            .setTitle(title)
            .setColor(color)
            .setDescription(desc)
    }
}

export const Embed: CustomEmbed = new CustomEmbed({});