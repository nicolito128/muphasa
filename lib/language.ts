import * as fs from "fs"
import { Database, IData } from "./json-db"

interface Translations {
    [k: string]: TranslationData;
} 

interface TranslationData {
    en: string;
    es: string;
}

export class LanguageHandler {
    readonly translation: string;
    readonly path: string;
    readonly regExpVariable: RegExp;
    guildId: string;
    data: Translations;

    constructor(translationName: string) {
        this.translation = translationName
        this.path = __dirname + `/../translations/${this.translation}.json`
        this.regExpVariable = new RegExp(/(%{[0-9]})/g)
        this.guildId = ""
        this.data = {}

        this.loadData()
    }

    private loadData(): void {
        const buff: Buffer = fs.readFileSync(this.path)
        this.data = JSON.parse(buff.toString()) as Translations
    }

    replaceWithVariables(str: string, variables: any[]): string {
        if (str.length < 4) return str;

        for (let i = 0, l = variables.length, el = variables[i]; i < l; i++) {
            const indexToReplace: string = '%{' + i + '}'
            const expExist = this.regExpVariable.test(indexToReplace)
            if (expExist) str = str.replace(indexToReplace, el)
        }

        return str
    }

    setGuildId(id: string) {
        this.guildId = id;
    }

    use(key: string, variables?: any[], guildId?: string): string {
        if (!guildId) guildId = this.guildId

        const guilds = new Database('guilds')
        const lang: 'en' | 'es' = (guilds.get(guildId) as IData).language as 'en' | 'es'

        let txt: string = this.data[key][lang] || ""
        if (variables) txt = this.replaceWithVariables(txt, variables)

        return txt
    }

    useByLang(key: string, lang: 'en' | 'es', variables?: any[]) {
        let txt: string = this.data[key][lang] || ""
        if (variables) txt = this.replaceWithVariables(txt, variables)
        
        return txt
    }
}
