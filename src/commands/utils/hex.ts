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
        let hex: string = '';
        let rgb: RGB | null = null;
        let rgbInEmbed: string = '';
        let image: string = 'https://dummyimage.com/1000x1000/';

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


		// validate RGB
        if ( 
			targets.length === 3 
		) {
			// it's necessary to validate that usable values were entered to convert to a color.
			const targetNumbers: number[] = targets.map(target => parseInt(target))
			if (targetNumbers.some(color => isNaN(color))) {
				message.channel.send('Si ingresas un código de colores RGB todos los parametros deben ser números.');
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
        }
		
		// validate color alias
		const targetIsAColorAlias: boolean = this.colorAlias.hasOwnProperty( toId(targets[0]) );
		if (targetIsAColorAlias) hex = this.colorAlias[targets[0]];

		if (targets.length === 1 && !targetIsAColorAlias ) {
			if (targets[0].startsWith('#')) {
				if (targets[0].length === 4) {
					// remove the "#" and repeat values to form a valid string
					hex = targets[0].substring(1) + targets[0].substring(1);
				} else {
					hex = targets[0].substring(1)
				}
			} else if (targets[0].length === 3) {
				// Does not include '#', so repeat values to form a valid string
				hex = targets[0] + targets[0]
			} else if (targets[0].length > 6) {
				hex = targets[0].substring(0, 7)
			} else {
				hex = targets[0]
			}
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
		const hexValue: string = Number(n).toString(16)
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