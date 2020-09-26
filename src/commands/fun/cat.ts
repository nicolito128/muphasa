import * as querystring from 'query-string'
import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'
const r2 = require('r2');

interface CatResponse {
    breeds: any[];
    id: string;
    url: string;
    width: number;
    height: number;
}

const apiURL = 'https://api.thecatapi.com/'
const apiKey = process.env.CAT_API_KEY

export = class CatCommand extends Command {
    readonly apiURL = 'https://api.thecatapi.com'
    private readonly apiKey = process.env.CAT_API_KEY || ""

	constructor(){
		super({
			name: 'cat',
			desc: '¡Devuelve gatitos!',
			group: 'fun',
            alias: ['michi']
		})
	}

	async run({message}: RunArguments) {
        try{
            const images = await this.loadImage(message.author.username);
            const image = images[0];

            const embed = Embed.notify({title: 'Cat!', desc: ''})
            .setImage(image.url)
            .setFooter('Impulsado por TheCatApi.com', 'https://api.thecatapi.com/favicon.ico')

            message.channel.send(embed)
        } catch(error) {
            message.channel.send('Ha ocurrido un error al consultar la api...')
            console.log(error)
        }
	}

    async loadImage(subid: string): Promise<CatResponse[]> {
        const headers = {
            'X-API-KEY': this.apiKey
        }

        const query_params = {
            //'has_breeds':true,
            'mime_types':'jpg,png',
            'size':'med',  
            'sub_id': subid, 
            'limit' : 1
        }

        let queryString = querystring.stringify(query_params)
        let response: CatResponse[] = []
    
        try {
            const url = apiURL + `v1/images/search?${queryString}`;
            response = await r2.get(url, {headers}).json
        } catch (e) {
            console.log(e)
        }

        return response;

    }


}