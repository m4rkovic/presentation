import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mediaDir = resolve(root, 'public', 'media')

const assets = [
  {
    file: 'hero.webp',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&fm=webp&w=1600&q=80',
  },
  {
    file: 'development.webp',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'devops.webp',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'testing.webp',
    url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'insurance.webp',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'energy.webp',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'telecom.webp',
    url: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'myqabee.webp',
    url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&fm=webp&w=1400&q=80',
  },
  {
    file: 'portrait-real.webp',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&fm=webp&w=960&q=82',
  },
  {
    file: 'portrait-ai.png',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/This_AI-generated_woman_does_not_exist.png?width=960',
  },
]

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

await mkdir(mediaDir, { recursive: true })

for (const asset of assets) {
  const output = resolve(mediaDir, asset.file)
  if (await exists(output)) {
    console.log(`media: keep ${asset.file}`)
    continue
  }

  console.log(`media: fetch ${asset.file}`)
  const response = await fetch(asset.url, {
    headers: { 'user-agent': 'ASCALab-event-build/1.0' },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${asset.file}: HTTP ${response.status}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  await writeFile(output, bytes)
  console.log(`media: wrote ${asset.file} (${Math.round(bytes.length / 1024)} KB)`)
}
