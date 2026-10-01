import { createRoot } from 'react-dom/client'
import { Gallery, Lightbox, PicGallery } from '../src/lib'
import type { GalleryAppearance, GalleryImage } from '../src/lib'

const svg = (width: number, height: number, fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${fill}"/></svg>`
  )}`

const palette = [
  '#2f4f8f',
  '#8f4f2f',
  '#2f8f6a',
  '#8f2f6a',
  '#6a8f2f',
  '#2f6a8f',
  '#8f6a2f',
  '#4f2f8f'
]

const dimensions: ReadonlyArray<readonly [number, number]> = [
  [1600, 1000],
  [1000, 1600],
  [1600, 1200],
  [1200, 1600],
  [1600, 1000],
  [1000, 1600],
  [1600, 1200],
  [1200, 1600]
]

const images: GalleryImage[] = dimensions.map(([width, height], index) => ({
  id: `image-${index}`,
  src: svg(width, height, palette[index % palette.length]),
  alt: `Image ${index + 1}`,
  width,
  height
}))

const params = new URLSearchParams(window.location.search)
const scenario = params.get('scenario') ?? 'grid'
const appearance = (params.get('appearance') as GalleryAppearance | null) ?? undefined
const noop = () => {}

function Fixture() {
  switch (scenario) {
    case 'grid':
      return <PicGallery images={images.slice(0, 6)} layout='grid' appearance={appearance} />
    case 'grid4':
      return (
        <PicGallery
          images={images}
          layout='grid'
          columns={4}
          appearance={appearance}
        />
      )
    case 'justified':
      return (
        <PicGallery
          images={images.slice(0, 6)}
          layout='justified'
          appearance={appearance}
        />
      )
    case 'mosaic':
      return (
        <PicGallery
          images={images.slice(0, 6)}
          layout='mosaic'
          appearance={appearance}
        />
      )
    case 'carousel':
      return (
        <PicGallery
          images={images.slice(0, 3)}
          layout='carousel'
          appearance={appearance}
        />
      )
    case 'gallery':
      return (
        <Gallery
          images={images.slice(0, 6)}
          onImageClick={noop}
          appearance={appearance}
        />
      )
    case 'lightbox':
      return <Lightbox images={images.slice(0, 4)} index={1} onIndexChange={noop} />
    case 'lightboxNav':
      return (
        <Lightbox
          images={images.slice(0, 4)}
          index={2}
          onIndexChange={noop}
          showNavigation
          showCounter
        />
      )
    default:
      throw new Error(`Unknown scenario: ${scenario}`)
  }
}

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element')

createRoot(container).render(<Fixture />)
