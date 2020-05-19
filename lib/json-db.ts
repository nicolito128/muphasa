'use strict';
import * as fs from "fs"

export interface IData {
    [k: string]: SpectedType;
}

type SpectedType = IData | IData[] | string | number | boolean | null

const root: string = __dirname + `/../db/`

function strictType(value: any): string {
    if (value instanceof Array) return 'array'
    if (value instanceof Set) return 'set'
    if (value instanceof Map) return 'map'
    if (value === null) return 'null'
    return typeof value
}

export function createDb(name: string): void {
    const path: string = root + `${name}.json`
    if (!fs.existsSync(root)) fs.mkdirSync(root)
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({}))
    }
}

export function deleteDb(name: string): void {
    const path: string = root + `${name}.json`
    if (fs.existsSync(path)) {
        fs.unlink(path, () => {
            console.log(`${path} was deleted!`);
        })
    }
}

export class Database {
    readonly file: string;
    readonly path: string;
    private data: IData;
    
    constructor(jsonName: string) {
        this.file = `${jsonName}.json`
        this.path = root + this.file
        this.data = {}

        createDb(jsonName)
        this.loadData()
    }

    loadData(): void {
        const buff: Buffer = fs.readFileSync(this.path)
        this.data = JSON.parse(buff.toString())
    }

    getData(): IData {
        return this.data
    }

    write(): void {
        fs.writeFileSync(this.path, JSON.stringify(this.data))
        this.loadData()
    }

    set(obj: IData): Database {
        Object.assign(this.data, obj)
        this.write()
        return this
    }

    put(key: string, value: SpectedType, concatArrays?: boolean): Database | null {
        const keyType: string = strictType(this.data[key])

        switch(keyType) {
            case 'array':
                if (concatArrays && value instanceof Array) {
                    (this.data[key] as SpectedType[]) = (this.data[key] as SpectedType[]).concat(value)
                } else {
                    (this.data[key] as SpectedType[]).push(value)
                }
                
                break;
            case 'object':
                if (strictType(value) == 'object') Object.assign((this.data[key] as IData), value)
                break;
            case 'string':
                (this.data[key] as string) += value
                break;
            case 'number':
                (this.data[key] as number) += value as number
                break;
            default:
                return null
        }

        this.write()
        return this
    }

    remove(key: string): Database | null {
        if (!this.has(key)) return null
        delete this.data[key]
        this.write()

        return this
    }

    get(key: string): SpectedType {
        if (!this.has(key)) return null
        return this.data[key]
    }

    has(key: string): boolean {
        return this.data.hasOwnProperty(key)
    }

    keys(): string[] {
        return Object.keys(this.data)
    }

    values(): SpectedType[] {
        return Object.values(this.data)
    }

    clear(): void {
        this.data = {}
        this.write()
    }
}
