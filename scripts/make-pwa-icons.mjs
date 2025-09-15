import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// This script generates required PWA icon sizes from a source PNG using sharp
// Usage:
//   1) Install dependency: npm i -D sharp
//   2) Run: node scripts/make-pwa-icons.mjs [optional:sourcePath]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ensureSharp() {
  try {
    const sharp = await import('sharp')
    return sharp.default || sharp
  } catch (e) {
    console.error('\nERROR: sharp is not installed. Install it with:')
    console.error('  npm i -D sharp')
    process.exit(1)
  }
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons')
const defaultSource = path.join(iconsDir, 'mylapkart1.png')
const source = process.argv[2] ? path.resolve(process.argv[2]) : defaultSource

const targets = [
  { size: 16 },
  { size: 32 },
  { size: 72 },
  { size: 96 },
  { size: 128 },
  { size: 144 },
  { size: 152 },
  { size: 180 },
  { size: 192 },
  { size: 384 },
  { size: 512 },
]

;(async () => {
  const sharp = await ensureSharp()

  if (!fs.existsSync(source)) {
    console.error(`\nERROR: Source image not found at: ${source}`)
    console.error('Provide a valid PNG source as first arg or place mylapkart1.png in /public/icons/')
    process.exit(1)
  }

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
  }

  const srcImage = sharp(source)
  const metadata = await srcImage.metadata()
  console.log('Source image:', source, `${metadata.width}x${metadata.height}`)

  for (const t of targets) {
    const filename = `icon-${t.size}x${t.size}.png`
    const outPath = path.join(iconsDir, filename)
    await srcImage
      .resize(t.size, t.size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(outPath)
    console.log('Generated', filename)
  }

  console.log('\nAll icons generated into /public/icons')
  console.log('Verify your manifest.json references these icons.')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
