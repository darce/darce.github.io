/** Export the dimension/number subset used by portfolio.tokens.json (DTCG 2025.10). */
function renderSassTokens(document) {
    const tokens = new Map()
    const visit = (group, prefix = [], inheritedType) => {
        if (!group || typeof group !== 'object' || Array.isArray(group)) throw new Error('Expected a token group')
        const type = group.$type ?? inheritedType
        for (const [name, entry] of Object.entries(group)) {
            if (name.startsWith('$')) continue
            if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`Unsupported token name: ${name}`)
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error(`Invalid token: ${name}`)
            const parts = [...prefix, name]
            if (Object.hasOwn(entry, '$value')) tokens.set(parts.join('.'), { type: entry.$type ?? type, value: entry.$value })
            else visit(entry, parts, type)
        }
    }
    visit(document)

    const resolve = (name, trail = []) => {
        if (trail.includes(name)) throw new Error(`Circular token reference: ${[...trail, name].join(' -> ')}`)
        const token = tokens.get(name)
        if (!token) throw new Error(`Unknown token: ${name}`)
        if (typeof token.value === 'string' && /^\{[^{}]+\}$/.test(token.value)) {
            const target = token.value.slice(1, -1)
            if (tokens.get(target)?.type !== token.type && tokens.has(target)) throw new Error(`Alias type mismatch: ${name} -> ${target}`)
            return resolve(target, [...trail, name])
        }
        if (token.type === 'number') {
            if (typeof token.value !== 'number' || !Number.isFinite(token.value)) throw new Error(`${name} must contain a finite number`)
            return String(token.value)
        }
        if (token.type === 'dimension') {
            const value = token.value
            if (!value || typeof value.value !== 'number' || !Number.isFinite(value.value) || !['px', 'rem'].includes(value.unit)) {
                throw new Error(`${name} must contain a numeric dimension in px or rem`)
            }
            return `${value.value}${value.unit}`
        }
        throw new Error(`Unsupported token type: ${name} (${token.type})`)
    }

    const names = new Set()
    const declarations = Array.from(tokens.keys(), name => {
        const variable = name.replaceAll('.', '-')
        if (names.has(variable)) throw new Error(`Sass token name collision: ${name}`)
        names.add(variable)
        return `$${variable}: ${resolve(name)};`
    })
    return `// Generated from design-tokens/portfolio.tokens.json. Run npm run tokens.\n// DTCG Format Module 2025.10: https://www.designtokens.org/tr/2025.10/format/\n${declarations.join('\n')}\n`
}

module.exports = { renderSassTokens }
