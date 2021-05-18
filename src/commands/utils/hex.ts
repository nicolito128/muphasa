import { CommandContext, Arguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
import Text from './../../lib/text'
const toId = Text.toId;

type RGB = {r: number, g: number, b: number}

export = class HexCommand extends CommandContext {
	readonly colorAlias: {[k: string]: string}

	constructor(){
		super({
			name: 'hex',
			desc: 'Muestra una imagen completamente del color hex/rgb ingresado. También puedes consulta una lista de colores por defecto ingresando como parametro la palabra "colors".',
			usage: 'hex | colors | red blue green',
			alias: ['rgb'],
			category: 'utils'
		})

		this.colorAlias = {
    		"red": "C51818",
    		"orange": "E7551B",
    		"yellow": "E5D813",
    		"gold": "ECA800",
    		"green": "30D320",
    		"lemongreen": "9AD91D",
    		"lemonyellow": "D9D01D",
    		"blue": "202BD3",
    		"cian": "29D1BF",
    		"skyblue": "76CEEC",
    		"lightblue": "00D5EA",
    		"purple": "641DD9",
    		"violet": "A01DD9",
    		"pink": "D320BD",
    		"lightpink": "F9A0FB",
    		"rose": "F9A0FB",
    		"crimson": "D91D4D",
    		"black": "000000",
    		"night": "202020",
    		"white": "FFFFFF",
    		"gray": "B1B1B1",
    		"brown": "441F10",
    		"lightbrown": "8F4527"
		}
	}

	run({message, targets, guild}: Arguments) {
        if (!targets.length || !targets[0]) {
            message.channel.send(`No ingresaste ningún color para mostrar.`);
            return;
        }

        if ( 
			targets[0] === 'alias' ||
			targets[0] === 'colors' ||
			targets[0] === 'colorlist'
		) {
            const embed = Embed.notify({
				title: 'Color List',
				desc: `\`${Object.keys(this.colorAlias).join(' - ')}\``
			});

            message.channel.send(embed);
            return;
        }

		let hex: string = '';
        let rgb: RGB | null = null;
        let rgbInEmbed: string = '';
        let image: string = 'https://dummyimage.com/1000x1000/';

		const isHexOrRGB: number = targets.length;
		switch (isHexOrRGB) {
			// hexadecimal
			case 1:
				// validate color alias
				const targetIsAColorAlias: boolean = this.colorAlias.hasOwnProperty( toId(targets[0]) );
				if (targetIsAColorAlias) {
					hex = this.colorAlias[targets[0]]
					return;
				}

				const hexLength: number = targets[0].length;
				if (targets[0].startsWith('#')) {
					if (hexLength === 4) {
						const subpart: string = targets[0].substring(1);
						hex = subpart + subpart;
					} else {
						hex = targets[0].substring(1);
					}
				} else {
					if (hexLength === 3) {
						hex = targets[0] + targets[0];
					} else {
						hex = targets[0];
					}
				}

				break;

			// rgb
			case 3:
				// it's necessary to validate that usable values were entered to convert to a color.
				const targetNumbers: number[] = targets.map(target => parseInt(target))
				if (targetNumbers.some(color => isNaN(color))) {
					message.channel.send('Si ingresas un código de colores RGB todos los parámetros deben ser números.');
					return;
				}

				if (targetNumbers.some(color => color > 255)) {
					message.channel.send('Los valores RGB no pueden ser superiores a 255.');
					return;
				}

				const red = targetNumbers[0];
				const green = targetNumbers[1];
				const blue = targetNumbers[2];

            	hex = this.rgbToHex(red, green, blue);
				rgb = {
					r: red,
					g:  green,
					b:  blue
				};
            	rgbInEmbed = `${red} ${green} ${blue}`;
				break;
			default:
				message.channel.send('No ingresaste ninguna forma de parámetro válido.\nHex: `#RRGGBB`\nRGB: `0 0 0`');
				return;
		}

        image += `${hex}/${hex}`;
        if (!rgb) rgb = this.hexToRgb(hex);
        if (!rgbInEmbed) rgbInEmbed = rgb ? rgb.r.toString() + ' ' + rgb.g.toString() + ' ' + rgb.b.toString() : 'NaN'

        const embed = Embed.notify({
        	title: '',
            desc: [
                `\`HEX: #${hex}\``,
                `\`RGB: ${rgbInEmbed}\``
            ]
        })
        .setImage(image)
        .setColor(`#${hex}`);

        message.channel.send(embed);
	}

	getHexValue(n: number): string {
		const value = Number(n).toString(16);
		const hexValue: string = value.length == 1 ? value + value : value;
		return hexValue;
	}

	rgbToHex(red: number, green: number, blue: number): string {
		return this.getHexValue(red) + this.getHexValue(green) + this.getHexValue(blue);
	}

 	hexToRgb(hex: string): RGB {
    	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['0', '0', '0'];
    	return {
      		r: parseInt(result[1], 16),
      		g: parseInt(result[2], 16),
      		b: parseInt(result[3], 16)
    		};
	}
}