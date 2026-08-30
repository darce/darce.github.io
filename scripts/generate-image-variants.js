const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const GEN_DIR = path.join(IMAGES_DIR, '_gen')
const MANIFEST_PATH = path.join(__dirname, '..', 'lib', 'generated', 'image-manifest.json')
const WIDTHS = [320, 480, 640, 960, 1280]
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png'])
const AVIF = { quality: 50, effort: 4 }
const WEBP = { quality: 75 }
const JPEG = { quality: 80, mozjpeg: true }
const PNG = { compressionLevel: 9, palette: true }

function collectSources(directory = IMAGES_DIR) {
    const sources = []

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            if (entryPath !== GEN_DIR) sources.push(...collectSources(entryPath))
            continue
        }

        if (entry.isFile() && SOURCE_EXT.has(path.extname(entry.name).toLowerCase())) {
            sources.push(entryPath)
        }
    }

    return sources
}

function removeEmptyDirectories(directory) {
    if (!fs.existsSync(directory)) return

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) removeEmptyDirectories(path.join(directory, entry.name))
    }

    if (directory !== GEN_DIR && fs.readdirSync(directory).length === 0) {
        fs.rmdirSync(directory)
    }
}

function pruneGeneratedFiles(expectedOutputs) {
    if (!fs.existsSync(GEN_DIR)) return 0
    let pruned = 0

    function prune(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name)
            if (entry.isDirectory()) {
                prune(entryPath)
            } else if (entry.isFile() && !expectedOutputs.has(entryPath)) {
                fs.unlinkSync(entryPath)
                pruned += 1
            }
        }
    }

    prune(GEN_DIR)
    removeEmptyDirectories(GEN_DIR)
    return pruned
}

async function main() {
    const sourcePaths = collectSources().sort()
    const expectedOutputs = new Set()
    const manifest = {}
    let filesWritten = 0

    for (const sourcePath of sourcePaths) {
        const key = path.relative(IMAGES_DIR, sourcePath).split(path.sep).join('/')
        const sourceExtension = path.extname(sourcePath).toLowerCase()
        const sourceDirectory = path.posix.dirname(key)
        const basename = path.posix.basename(key, path.posix.extname(key))
        const fallbackExtension = sourceExtension === '.png' ? 'png' : 'jpg'
        const fallbackType = sourceExtension === '.png' ? 'image/png' : 'image/jpeg'
        const buffer = fs.readFileSync(sourcePath)
        const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8)
        const metadata = await sharp(buffer).metadata()

        if (!metadata.width || !metadata.height) {
            throw new Error(`Missing image dimensions for ${key}`)
        }

        const widths = WIDTHS.filter((width) => width <= metadata.width)
        if (widths.length === 0) widths.push(metadata.width)

        const candidates = {
            avif: [],
            webp: [],
            fallback: [],
        }
        const tasks = []

        for (const width of widths) {
            const formats = [
                { name: 'avif', extension: 'avif', options: AVIF },
                { name: 'webp', extension: 'webp', options: WEBP },
                {
                    name: 'fallback',
                    extension: fallbackExtension,
                    options: fallbackExtension === 'png' ? PNG : JPEG,
                },
            ]

            for (const format of formats) {
                const filename = `${basename}.${hash}-${width}.${format.extension}`
                const relativeOutput = sourceDirectory === '.'
                    ? filename
                    : path.posix.join(sourceDirectory, filename)
                const outputPath = path.join(GEN_DIR, ...relativeOutput.split('/'))
                const src = `/images/_gen/${relativeOutput}`

                expectedOutputs.add(outputPath)
                candidates[format.name].push({ w: width, src })

                if (fs.existsSync(outputPath)) continue

                tasks.push((async () => {
                    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
                    let image = sharp(buffer).resize({ width, withoutEnlargement: true })
                    if (format.name === 'avif') image = image.avif(format.options)
                    if (format.name === 'webp') image = image.webp(format.options)
                    if (format.name === 'fallback' && fallbackExtension === 'jpg') {
                        image = image.jpeg(format.options)
                    }
                    if (format.name === 'fallback' && fallbackExtension === 'png') {
                        image = image.png(format.options)
                    }
                    await image.toFile(outputPath)
                    filesWritten += 1
                })())
            }
        }

        await Promise.all(tasks)

        manifest[key] = {
            width: metadata.width,
            height: metadata.height,
            hash,
            avif: candidates.avif,
            webp: candidates.webp,
            fallback: {
                type: fallbackType,
                candidates: candidates.fallback,
            },
        }
    }

    const pruned = pruneGeneratedFiles(expectedOutputs)
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
    console.error(`image-variants: ${sourcePaths.length} sources, ${filesWritten} files written, ${pruned} pruned`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
