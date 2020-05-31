import * as superagent from 'superagent'
import { Embed } from '../../lib/embed'
import { toId } from '../../lib/text'

interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    sprites: PokemonSprites;
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    types: PokemonType[];
}

interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: ApiResource;
}

interface PokemonSprites {
    front_default: string;
    front_shiny: string;
    front_female: string | null;
    front_shiny_female: string | null;

    back_default: string;
    back_shiny: string;
    back_female: string | null;
    back_shiny_female: string | null;
}

interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: ApiResource;
}

interface PokemonType {
    slot: number;
    type: ApiResource;
}

interface ApiResource {
    name: string;
    url: string;
}

// Pokemon data for command
interface PokemonTarget {
    id: number;
    specie: string;
    shiny: boolean;
    mega: boolean;
}

const pokeAPI = 'https://pokeapi.co/api/v2'

async function getPokemonFromApi(pokemon: string | number): Promise<Pokemon | null> {
    try {
        const {body} = await superagent
        .get(`${pokeAPI}/pokemon/${pokemon}`)

        return body as Pokemon
    } catch(err) {
        console.log(new Error(`Query to PokeAPI rejected!\n` + err))
        return null
    }
}

function parseMessageToPokemon(message: string): PokemonTarget {
    let data: PokemonTarget = {
        id: 0,
        specie: '',
        shiny: false,
        mega: false
    }

    const isMega = /([a-zA-Z]-mega$|[a-zA-Z]-mega\s|[a-zA-Z]-mega-x$|[a-zA-Z]-mega-x\s|[a-zA-Z]-mega-y$|[a-zA-Z]-mega-y\s)/g

    if (!isNaN(parseInt(message))) data.id = parseInt(message)
    if (isMega.test(message)) {
        if (/(charizard)/g.test(message)) {
            if (/([a-zA-Z]-mega-x$|[a-zA-Z]-mega-x\s)/g.test(message)) {
                data.specie = 'charizard-mega-x'
            } else {
                data.specie = 'charizard-mega-y'
            }
        } else {
            data.specie = message.replace(/(-mega$|-mega\s)/g, '').toLowerCase()
        }

        data.mega = true
    } else {
        data.specie = message.toLowerCase()
    }

    return data
}

function parsePokemonWeight(weight: number): string {
    let strWeight: string = weight.toString()
    let len: number = strWeight.length

    if (len == 1) {
        strWeight = `0.${strWeight}`
    } else if (len >= 2) {
        strWeight = strWeight.slice(0, len - 1)
    }

    return strWeight
}

export const commands: Types.ICommands = {
    async dex({message, user, targets}) {
        if (!targets || targets.length < 1) return message.channel.send('Debes ingresar más información del pokémon para buscarlo.')

        const target: PokemonTarget = parseMessageToPokemon(targets.join())
        let poke: Pokemon | null = null

        if (target.id != 0) {
            poke = await getPokemonFromApi(target.id)
        } else if (target.specie) {
            if (target.mega) {
                if (target.specie.includes('charizard')) {
                    poke = await getPokemonFromApi(target.specie)
                } else {
                    poke = await getPokemonFromApi(target.specie + '-mega')
                }
            }

            if (target.specie.includes('aegislash')) {
                poke = await getPokemonFromApi('aegislash-shield')
            } else {
                poke = await getPokemonFromApi(target.specie)
            }
        }

        if (!poke) return message.channel.send('No se pudo encontrar información sobre el pokémon.')

        const pokeEmbed = Embed.notify(`${poke.name[0].toUpperCase() + poke.name.slice(1)} #${poke.id}`, '')
        .setAuthor(`${user.username}#${user.discriminator}`, (user.avatarURL() || ""))
        .setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
        
        let desc: string = ""
        poke.stats.forEach((value) => {
            switch(value.stat.name) {
                case 'speed':
                    desc += `**Spe:** \`${value.base_stat}\` `
                    break;
                case 'special-defense':
                    desc += `**Sp. Def:** \`${value.base_stat}\` `
                    break;
                case 'special-attack':
                    desc += `**Sp. Atk:** \`${value.base_stat}\` `
                    break;
                case 'defense':
                    desc += `**Def:** \`${value.base_stat}\` `
                    break;
                case 'attack':
                    desc += `**Atk:** \`${value.base_stat}\` `
                    break;
                case 'hp':
                    desc += `**HP:** \`${value.base_stat}\``
                    break;
            }
        })
        pokeEmbed
        .setDescription(desc)
        .addField('Abilities', poke.abilities.map(ab => ab.ability.name), true)
        .addField('Types', poke.types.map(tp => tp.type.name), true)
        .addField('More', [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}cm`], true)
        .setImage(poke.sprites.front_default)
        .setThumbnail(poke.sprites.front_shiny)
        
        message.channel.send(pokeEmbed)
    }
}