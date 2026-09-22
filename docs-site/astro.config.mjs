import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://marcelrsoub.github.io',
  base: '/react-pic-gallery/',
  srcDir: './docs-site/src',
  publicDir: './docs-site/public',
  outDir: './build',
  integrations: [
    react(),
    starlight({
      title: 'react-pic-gallery',
      description: 'A small, accessible React image gallery and lightbox.',
      sidebar: [
        { label: 'Quick start', slug: 'docs/getting-started' },
        { label: 'Playground', link: '/react-pic-gallery/' },
        { label: 'Overview', slug: 'docs' },
        {
          label: 'Guides',
          items: [
            { label: 'Customization', slug: 'docs/customization' },
            { label: 'Styling', slug: 'docs/styling' },
            { label: 'Accessibility', slug: 'docs/accessibility' }
          ]
        },
        {
          label: 'Reference',
          items: [
            { label: 'API', slug: 'docs/api' },
            { label: 'Migrating from v1', slug: 'docs/migration-v1' }
          ]
        }
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/marcelrsoub/react-pic-gallery'
        }
      ],
      editLink: {
        baseUrl:
          'https://github.com/marcelrsoub/react-pic-gallery/edit/main/'
      },
      customCss: ['./docs-site/src/styles/custom.css']
    })
  ]
})
