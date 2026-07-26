import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'Art du Français",
    short_name: 'Art du Français',
    description: 'A reading-first French course for grammar and vocabulary.',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#f9f9f9',
    theme_color: '#003e7a',
    icons: [
      { src: `${basePath}/favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${basePath}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${basePath}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
