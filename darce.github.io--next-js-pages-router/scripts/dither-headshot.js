const sharp = require('sharp')
const path = require('path')

const INPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300.jpg')
const OUTPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300-dithered.png')

// 8x8 Bayer threshold matrix (normalized to 0-255)
const BAYER_8x8 = [
    [ 0, 128,  32, 160,   8, 136,  40, 168],
    [192,  64, 224,  96, 200,  72, 232, 104],
    [ 48, 176,  16, 144,  56, 184,  24, 152],
    [240, 112, 208,  80, 248, 120, 216,  88],
    [ 12, 140,  44, 172,   4, 132,  36, 164],
    [204,  76, 236, 108, 196,  68, 228, 100],
    [ 60, 188,  28, 156,  52, 180,  20, 148],
    [252, 124, 220,  92, 244, 116, 212,  84],
]

async function bayerDither() {
    const image = sharp(INPUT).grayscale()
    const { width, height } = await image.metadata()
    const { data } = await image.raw().toBuffer({ resolveWithObject: true })

    const out = Buffer.alloc(width * height)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * width + x
            const gray = data[i]
            const threshold = BAYER_8x8[y % 8][x % 8]
            out[i] = gray > threshold ? 255 : 0
        }
    }

    await sharp(out, { raw: { width, height, channels: 1 } })
        .png()
        .toFile(OUTPUT)

    console.log(`Dithered headshot written to ${OUTPUT} (${width}x${height})`)
}

bayerDither().catch(err => {
    console.error(err)
    process.exit(1)
})
