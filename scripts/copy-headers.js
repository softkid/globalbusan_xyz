/**
 * Copy _headers and _redirects files to dist after build
 * Cloudflare Pages requires these files in the build output directory
 */

import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const distDir = join(rootDir, 'dist')
const publicDir = join(rootDir, 'public')

const filesToCopy = ['_headers', '_redirects']

filesToCopy.forEach((file) => {
  const sourcePath = join(publicDir, file)
  const destPath = join(distDir, file)

  if (existsSync(sourcePath)) {
    try {
      copyFileSync(sourcePath, destPath)
      console.log(`✓ Copied ${file} to dist/`)
    } catch (error) {
      console.error(`✗ Failed to copy ${file}:`, error)
      process.exit(1)
    }
  } else {
    console.warn(`⚠ ${file} not found in public/`)
  }
})

console.log('✓ Headers and redirects files copied successfully')

