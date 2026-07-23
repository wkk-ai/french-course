import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'Art du Français",
    short_name: 'Art du Français',
    description: 'A reading-first French course for grammar and vocabulary.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f9f9',
    theme_color: '#003e7a',
    icons: [{ src: '/file.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
