const sharp = require('sharp')
const path = require('path')

const INPUT = path.join(__dirname, '..', 'public', 'images', 'headshot-6-300.jpg')
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')

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

/**
 * Generate a dithered image at an exact pixel size.
 * The source is resized FIRST (with good interpolation), then dithered.
 * This means each pixel in the output is a deliberate dithering decision
 * at that resolution — not a browser-rescaled approximation.
 */
async function generateAtSize(size, suffix) {
    const image = sharp(INPUT).resize(size, size).grayscale()
    const { data } = await image.raw().toBuffer({ resolveWithObject: true })

    const out = atkinsonDither(data, size, size)
    const outputPath = path.join(IMAGES_DIR, `headshot-dithered-atkinson-${suffix}.png`)

    await sharp(out, { raw: { width: size, height: size, channels: 1 } })
        .png()
        .toFile(outputPath)

    console.log(`  ${outputPath} (${size}x${size})`)
}

async function run() {
    console.log('Generating Atkinson-dithered headshots at display sizes:')

    // Each size matches an exact CSS display context.
    // Use image-rendering: pixelated so browsers render 1:1 pixels.
    await generateAtSize(300, '300')  // about page desktop
    await generateAtSize(200, '200')  // about page mobile
    await generateAtSize(120, '120')  // landing page desktop
    await generateAtSize(96, '96')    // landing page mobile

    console.log('Done.')
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})
