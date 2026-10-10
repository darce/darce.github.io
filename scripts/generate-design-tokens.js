const fs = require('node:fs')
const path = require('node:path')
const { renderSassTokens } = require('./lib/design-tokens')

const root = path.resolve(__dirname, '..')
const source = JSON.parse(fs.readFileSync(path.join(root, 'design-tokens/portfolio.tokens.json'), 'utf8'))
const destination = path.join(root, 'styles/generated/_portfolio-tokens.scss')
fs.mkdirSync(path.dirname(destination), { recursive: true })
fs.writeFileSync(destination, renderSassTokens(source))
