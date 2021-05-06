export default class Text {
    static toId(str: string) {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, '')
    }

    static isId(str: string) {
        if (str === this.toId(str)) return true
        return false
    }

    static reverse(str: string) {
        return str.split('').reverse().join('')
    }
}