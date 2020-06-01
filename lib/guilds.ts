/**
 * Guilds Handler System
 * @author Nicolás Serna
 * 
 * Logic responsible for adding, removing or obtaining information about guilds settings.
**/
import * as Config from '../config/config.js'
import { Database, IData, SpectedType } from './json-db'

export interface IGuildData {
    language?: 'es' | 'en';
    banwords?: string[];
    prefix?: string;
    [k: string]: any;
}

class GuildsHandler {
    data: Database;

    constructor() {
        this.data = new Database('guilds')
    }

    set(guildId: string, value: IGuildData): GuildsHandler {
        if (this.data.has(guildId)) {
            let obj = Object.assign(this.data.get(guildId), value)
            this.data.set({[guildId]: obj})
        }
        
        return this
    }

    put(key: string, value: SpectedType, concatArrays?: boolean): GuildsHandler {
        if (!concatArrays) concatArrays = false;
        this.data.put(key, value, concatArrays)
        return this
    }

    get(guildId: string): IGuildData {
        return this.data.get(guildId) as IGuildData
    }

    setGlobalKey(key: string, value: SpectedType): GuildsHandler {
        this.data.keys().forEach((id: string) => {
            const guildData = this.data.get(id)
            if (guildData) {
                (guildData as IData)[key] = value
                this.data.set({[id]: guildData})
            }
        })

        return this
    }

    removeGlobalKey(key: string): GuildsHandler {
        this.data.keys().forEach((id: string) => {
            const guild = this.data.get(id)
            this.data.removePropertyOfObjectKey(id, key)
        })

        return this
    }

    getPrefix(guildId: string): string {
        const cur: IGuildData = this.data.get(guildId) as IGuildData
        if (cur.prefix) return cur.prefix;
        return Config.prefix
    }
}

export const Guilds = new GuildsHandler()