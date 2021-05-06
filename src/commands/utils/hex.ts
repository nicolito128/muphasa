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
			group: 'utils'
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
        let rgb: RGB = Object.create(null);
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

        const targetsParsed: number[] = targets.map(target => parseInt(target))

		// validate RGB
        if ( 
			targetsParsed.length > 1 &&
			targetsParsed.length < 3
		) {
            message.channel.send(`Si ingresas un valor RGB debes pasar 3 parametros.`);
            return;
        } else if ( targetsParsed.length === 3 ) {
			// it's necessary to validate that usable values were entered to convert to a color.
            targetsParsed.forEach(target => {
                if (isNaN(target)) {
                    message.channel.send('Si ingresas valores RGB todos los parametros deben ser números.');
                    return;
                }
            })

            hex = this.rgbToHex(targetsParsed[0], targetsParsed[1], targetsParsed[2]);
            rgbInEmbed = `${targetsParsed[0]} ${targetsParsed[1]} ${targetsParsed[2]}`;
        }
		
		// validate color alias
		if ( this.colorAlias.hasOwnProperty( toId(targets[0]) ) ) hex = this.colorAlias[targets[0]];

		// validate hex
		if (targets[0].startsWith('#')) {
			if (targets[0].length === 4) {
				// remove the "#" and repeat values to form a valid string
				hex = targets[0].substring(1) + targets[0].substring(1);
			}

			hex = targets[0].substring(1)
		} else {
			// Does not include '#', so repeat values to form a valid string
			if (targets[0].length === 3) {
				hex = targets[0] + targets[0]
			}

			hex = targets[0]
		}

        image += `${hex}/${hex}`;
        rgb = this.hexToRgb(hex.toString());
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

	private getHexValue(n: number): string {
		const hexValue: string = Number(n).toString(16)
		return hexValue;
	}

	private rgbToHex(r: number, g: number, b: number): string {
		return this.getHexValue(r) + this.getHexValue(g) + this.getHexValue(b);
	}

 	private hexToRgb(hex: string): RGB {
		let str = hex;
		if (hex.length > 6) str = hex.substring(0, 7);

    	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str) || ['0', '0', '0'];
    	return {
      		r: parseInt(result[1], 16),
      		g: parseInt(result[2], 16),
      		b: parseInt(result[3], 16)
    		};
	}
}