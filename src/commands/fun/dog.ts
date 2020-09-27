import * as superagent from 'superagent'
import { Command, RunArguments } from './../../lib/command'
import { Embed } from './../../lib/embed'

interface DogResponse {
    message: string;
    status: string;
}

export = class DogCommand extends Command {
    readonly apiURL = 'https://dog.ceo/api/breeds/image/random'

	constructor(){
		super({
			name: 'dog',
			desc: '¡Devuelve perritos!',
			group: 'fun',
            alias: ['goodboy'],
            cooldown: 10
		})
	}

	async run({message, user}: RunArguments) {
        try{
            const image = await this.getRandomDog()
            const embed = Embed.notify({title: 'Dog!', desc: ''})
            .setURL(image.message)
            .setImage(image.message)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setFooter('Impulsado por dog.ceo', 'https://dog.ceo/img/favicon.png')

            message.channel.send(embed)
        } catch(error) {
            message.channel.send('Ha ocurrido un error al consultar la api...')
            console.log(error)
        }
	}

    async getRandomDog(): Promise<DogResponse> {
        const cat = await superagent.get(this.apiURL)
        return cat.body as unknown as DogResponse
    }
}