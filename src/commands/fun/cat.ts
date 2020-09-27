import * as superagent from 'superagent'
import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

interface CatResponse {
    file: string
}

export = class CatCommand extends Command {
    readonly apiURL = 'https://aws.random.cat/meow'

	constructor(){
		super({
			name: 'cat',
			desc: '¡Devuelve gatitos!',
			group: 'fun',
            alias: ['michi'],
            cooldown: 10
		})
	}

	async run({message, user}: RunArguments) {
        try{
            const image = await this.getRandomCat()
            const embed = Embed.notify({title: 'Cat!', desc: ''})
            .setURL(image.file)
            .setImage(image.file)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setFooter('Impulsado por random.cat', 'https://purr.objects-us-east-1.dream.io/static/img/random.cat-logo.png')

            message.channel.send(embed)
        } catch(error) {
            message.channel.send('Ha ocurrido un error al consultar la api...')
            console.log(error)
        }
	}

    async getRandomCat(): Promise<CatResponse> {
        const cat = await superagent.get(this.apiURL)
        return cat.body as unknown as CatResponse
    }
}