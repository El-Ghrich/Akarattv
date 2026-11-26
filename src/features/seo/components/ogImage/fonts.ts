import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Satori cannot parse variable fonts: it crashes in `parseFvarAxis` before any
 * markup is laid out. The cards therefore use static Cairo instances generated
 * from the variable file the site itself self-hosts (same typeface, one file
 * per weight), subset to the Arabic + Latin ranges the site writes. They are
 * read once per server process.
 */
const FONT_FILES = [
  { file: 'Cairo-Regular.ttf', weight: 400 },
  { file: 'Cairo-Bold.ttf', weight: 700 },
  { file: 'Cairo-Black.ttf', weight: 900 },
] as const

export const fonts = await Promise.all(
  FONT_FILES.map(async ({ file, weight }) => ({
    data: await readFile(path.join(process.cwd(), 'src/fonts', file)),
    name: 'Cairo',
    style: 'normal' as const,
    weight,
  })),
)
