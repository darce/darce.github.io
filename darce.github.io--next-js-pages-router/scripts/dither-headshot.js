const sharp = require('sharp')
const path = require('path')

const INPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300.jpg')
const OUTPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300-dithered-atkinson.png')

/**
 * Atkinson dithering — distributes 6/8 of the quantization error to
 * six neighboring pixels. The remaining 1/4 is discarded, which
 * preserves more contrast than Floyd-Steinberg and produces the
 * characteristic high-contrast look from the original Macintosh.
 *
 * Diffusion pattern (current pixel marked *):
 *
 *          *   1/8  1/8
 *    1/8  1/8  1/8
 *         1/8
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

            // Spread 6/8 of error to six neighbors
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

async function run() {
    const image = sharp(INPUT).grayscale()
    const { width, height } = await image.metadata()
    const { data } = await image.raw().toBuffer({ resolveWithObject: true })

    const out = atkinsonDither(data, width, height)

    await sharp(out, { raw: { width, height, channels: 1 } })
        .png()
        .toFile(OUTPUT)

    console.log(`Atkinson-dithered headshot written to ${OUTPUT} (${width}x${height})`)
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})
