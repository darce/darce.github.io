const sharp = require('sharp')
const path = require('path')

const INPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300.jpg')
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')

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

/**
 * Bayer (ordered) dithering — compares each pixel against a fixed
 * threshold matrix. Produces a regular geometric dot pattern.
 * Works well at small sizes where error diffusion loses detail.
 */
function bayerDither(pixels, width, height) {
    const out = Buffer.alloc(width * height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * width + x
            const threshold = BAYER_8x8[y % 8][x % 8]
            out[i] = pixels[i] > threshold ? 255 : 0
        }
    }
    return out
}

/**
 * Atkinson dithering — distributes 6/8 of the quantization error to
 * six neighboring pixels. The remaining 1/4 is discarded, which
 * preserves more contrast than Floyd-Steinberg.
 */
function atkinsonDither(pixels, width, height) {
    const buf = Float64Array.from(pixels)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * width + x
            const old = buf[i]
            const val = old > 128 ? 255 : 0
            buf[i] = val
            const err = (old - val) / 8

            if (x + 1 < width)                          buf[i + 1]         += err
            if (x + 2 < width)                          buf[i + 2]         += err
            if (y + 1 < height) {
                if (x - 1 >= 0)                         buf[i + width - 1] += err
                                                        buf[i + width]     += err
                if (x + 1 < width)                      buf[i + width + 1] += err
            }
            if (y + 2 < height)                         buf[i + 2 * width] += err
        }
    }

    const out = Buffer.alloc(width * height)
    for (let i = 0; i < buf.length; i++) {
        out[i] = buf[i] > 128 ? 255 : 0
    }
    return out
}

async function generate(size, algorithm) {
    const image = sharp(INPUT).resize(size, size).grayscale()
    const { data } = await image.raw().toBuffer({ resolveWithObject: true })

    const dither = algorithm === 'bayer' ? bayerDither : atkinsonDither
    const out = dither(data, size, size)
    const outputPath = path.join(IMAGES_DIR, `headshot-dithered-${algorithm}-${size}.png`)

    await sharp(out, { raw: { width: size, height: size, channels: 1 } })
        .png()
        .toFile(outputPath)

    console.log(`  ${algorithm} ${size}px → ${outputPath}`)
}

async function run() {
    console.log('Generating dithered headshots:')

    // Large sizes: Atkinson (high contrast, organic texture)
    await generate(300, 'atkinson')  // about page desktop
    await generate(200, 'atkinson')  // about page mobile

    // Small sizes: Bayer (geometric pattern holds up better at low resolution)
    await generate(120, 'bayer')     // landing page desktop
    await generate(96, 'bayer')      // landing page mobile

    console.log('Done.')
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})
