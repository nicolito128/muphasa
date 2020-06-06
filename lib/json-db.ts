/**
 * Json Handler System for Muphasa
 * @author Nicolás Serna
 * 
 * This functionality is responsible for managing a folder of .json files.
**/
import * as fs from "fs"

export interface IData {
    [k: string]: any;
}

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

    private loadData(): void {
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

    /**
     * @todo Set or overwrite properties in the file.
     * @example set({[key]: value})
     */
    set(obj: IData): Database {
        Object.assign(this.data, obj)

        this.write()
        return this
    }


    /**
     * 
     * @todo Modification of a property based on the specified value. For example: if the property (key) contains a number and value is a number, then they will be added together.
     * @example put('names', ['Carl', 'Jimmy'], true)
     * @example put('age', 1)
     */
    put(key: string, value: any, concatArrays?: boolean): Database | null {
        const keyType: string = strictType(this.data[key])

        switch(keyType) {
            case 'array':
                if (concatArrays && value instanceof Array) {
                    (this.data[key] as any[]) = (this.data[key] as any[]).concat(value)
                } else {
                    (this.data[key] as any[]).push(value)
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

    /**
     * @todo Remove a property
     */
    remove(key: string): Database {
        if (this.has(key)) {
            delete this.data[key]
            this.write()
        }

        return this
    }

    /**
     * @todo Delete a property inside an object property
     */
    removePropertyOfObjectKey(key: string, prop: string): Database {
        if (strictType(this.data[key]) == 'object' && (this.data[key] as IData).hasOwnProperty(prop)) {
            delete (this.data[key] as IData)[prop]
            this.write()
        }

        return this
    }

    /**
     * @todo Get a key value
     */
    get(key: string): any {
        if (this.has(key)) return this.data[key]
        return undefined as void
    }

    /**
     * @todo Check if a property exists
     */
    has(key: string): boolean {
        return this.data.hasOwnProperty(key)
    }

    keys(): string[] {
        return Object.keys(this.data)
    }

    values(): any[] {
        return Object.values(this.data)
    }

    call(callback: () => void) {
        return callback.call(this)
    }

    clear(): void {
        this.data = {}
        this.write()
    }
}
