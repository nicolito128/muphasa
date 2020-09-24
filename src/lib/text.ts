export function toId(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

export function isId(str: string) {
    if (str === toId(str)) return true
    return false
}

export function reverse(str: string) {
    return str.split('').reverse().join('')
}
