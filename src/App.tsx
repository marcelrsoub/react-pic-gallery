import { useState, type ReactNode } from 'react'
import {
  PicGallery,
  type GalleryImage,
  type GalleryLayout,
  type LightboxContext
} from './lib'
import './App.css'

type ExifImage = GalleryImage & {
  exif?: {
    camera?: string
    lens?: string
    focalLength?: string
    aperture?: string
    shutter?: string
    iso?: number
    taken?: string
  }
}

const images: ExifImage[] = [
  {
    id: 'coast',
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80',
    alt: 'A calm blue coast under a bright sky',
    width: 1800,
    height: 1200,
    caption: 'Blue hour on the coast'
  },
  {
    id: 'forest',
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80',
    alt: 'Sunlight through a dense green forest',
    width: 1200,
    height: 1800,
    caption: 'A quiet path through the forest'
  },
  {
    id: 'mountain',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
    alt: 'Snow-capped mountains reflected in a lake',
    width: 1800,
    height: 1200,
    caption: 'Morning light in the mountains'
  },
  {
    id: 'desert',
    src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=700&q=80',
    alt: 'Layered desert dunes under a pale sky',
    width: 1200,
    height: 1800,
    caption: 'Wind-shaped dunes'
  },
  {
    id: 'lake',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80',
    alt: 'A mountain lake surrounded by green hills',
    width: 1800,
    height: 1200,
    caption: 'Still water, early morning'
  },
  {
    id: 'cliffs',
    src: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=700&q=80',
    alt: 'Dark cliffs beside a deep blue sea',
    width: 1800,
    height: 1200,
    caption: 'Where the land meets the sea'
  },
  {
    id: 'canyon',
    src: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=700&q=80',
    alt: 'Red canyon walls beneath a wide sky',
    width: 1200,
    height: 1800,
    caption: 'Layers of red rock'
  },
  {
    id: 'waterfall',
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=700&q=80',
    alt: 'A waterfall flowing through a green valley',
    width: 1200,
    height: 1800,
    caption: 'A clear mountain waterfall'
  },
  {
    id: 'meadow',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
    alt: 'A grassy meadow beneath distant mountains',
    width: 1800,
    height: 1200,
    caption: 'Open ground beneath the peaks'
  }
]

const exifByAlt: Record<string, ExifImage['exif']> = {
  'A calm blue coast under a bright sky': {
    camera: 'Fujifilm X-T5',
    lens: 'XF 23mm f/1.4',
    focalLength: '23mm',
    aperture: 'f/8',
    shutter: '1/250s',
    iso: 125,
    taken: '2024-05-12 06:41'
  },
  'Sunlight through a dense green forest': {
    camera: 'Sony A7 IV',
    lens: 'FE 24-70mm f/2.8 GM',
    focalLength: '42mm',
    aperture: 'f/4',
    shutter: '1/60s',
    iso: 800,
    taken: '2024-09-03 10:17'
  },
  'Snow-capped mountains reflected in a lake': {
    camera: 'Canon EOS R6 Mark II',
    lens: 'RF 15-35mm f/2.8 L',
    focalLength: '18mm',
    aperture: 'f/11',
    shutter: '1/320s',
    iso: 100,
    taken: '2023-11-25 07:52'
  },
  'Layered desert dunes under a pale sky': {
    camera: 'Nikon Z 7II',
    lens: 'Nikkor Z 70-200mm f/2.8',
    focalLength: '135mm',
    aperture: 'f/5.6',
    shutter: '1/1000s',
    iso: 64,
    taken: '2024-07-19 18:05'
  },
  'A mountain lake surrounded by green hills': {
    camera: 'Sony A7R V',
    lens: 'FE 16-35mm f/2.8 GM',
    focalLength: '24mm',
    aperture: 'f/9',
    shutter: '1/125s',
    iso: 100,
    taken: '2024-06-08 09:23'
  },
  'Dark cliffs beside a deep blue sea': {
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 32-64mm f/4 R LM WR',
    focalLength: '45mm',
    aperture: 'f/7.1',
    shutter: '1/500s',
    iso: 160,
    taken: '2023-10-14 16:58'
  }
}

const exifImages: ExifImage[] = images
  .slice(0, 6)
  .map((image) => ({ ...image, exif: exifByAlt[image.alt] }))

const basicSnippet = `import { PicGallery } from 'react-pic-gallery'
import 'react-pic-gallery/styles.css'

<PicGallery images={images} />`

const actionsSnippet = `<PicGallery
  images={images}
  renderActions={({ image }) => (
    <button type="button" onClick={() => save(image)}>
      Save
    </button>
  )}
/>`

const controlsSnippet = `<PicGallery
  images={images}
  renderControls={({ close, next, previous }) => (
    <div>
      <button type="button" onClick={previous}>Back</button>
      <button type="button" onClick={next}>Next</button>
      <button type="button" onClick={close}>Close</button>
    </div>
  )}
/>`

function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard

  const copyCode = async () => {
    if (!canCopy) return

    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className='code-block'>
      <div className='code-block__topline'>
        <span className='code-block__language'>{language}</span>
        <button type='button' onClick={copyCode} disabled={!canCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}

const installCommands: Array<{ value: string; label: string; command: string }> = [
  { value: 'npm', label: 'npm', command: 'npm install react-pic-gallery' },
  { value: 'pnpm', label: 'pnpm', command: 'pnpm add react-pic-gallery' },
  { value: 'yarn', label: 'Yarn', command: 'yarn add react-pic-gallery' },
  { value: 'bun', label: 'Bun', command: 'bun add react-pic-gallery' }
]

function InstallCommand() {
  const [manager, setManager] = useState('npm')
  const active =
    installCommands.find((option) => option.value === manager) ?? installCommands[0]

  return (
    <div className='install-command'>
      <div className='layout-switcher' role='group' aria-label='Package manager'>
        {installCommands.map((option) => (
          <button
            type='button'
            key={option.value}
            aria-pressed={manager === option.value}
            onClick={() => setManager(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <CodeBlock code={active.command} language='bash' />
    </div>
  )
}

function SaveAction({ image }: LightboxContext<GalleryImage>) {
  const [saved, setSaved] = useState(false)

  return (
    <button
      className='demo-action'
      type='button'
      onClick={() => setSaved((current) => !current)}
      aria-label={`${saved ? 'Remove' : 'Save'} ${image.alt}`}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

function CustomControls({
  close,
  next,
  previous,
  index,
  count
}: LightboxContext<GalleryImage>) {
  return (
    <div className='demo-custom-controls'>
      <span>{index + 1} / {count}</span>
      <div>
        <button type='button' onClick={previous} aria-label='Previous image'>Back</button>
        <button type='button' onClick={next} aria-label='Next image'>Next</button>
        <button type='button' onClick={close}>Close</button>
      </div>
    </div>
  )
}

const exifSnippet = `type ExifImage = GalleryImage & {
  exif?: { camera: string; aperture: string; iso: number }
}

<PicGallery
  images={exifImages}
  renderCaption={({ image }) => <ExifCaption image={image} />}
/>`

function ExifCaption({ image }: { image: ExifImage }) {
  const exif = image.exif

  return (
    <div className='exif-caption'>
      <p className='exif-caption__title'>{image.caption ?? image.alt}</p>
      {exif && (
        <dl className='exif-caption__data'>
          {[
            exif.camera,
            exif.lens,
            exif.focalLength,
            exif.aperture,
            exif.shutter,
            exif.iso !== undefined ? `ISO ${exif.iso}` : undefined,
            exif.taken
          ]
            .filter(Boolean)
            .map((value) => (
              <div className='exif-caption__chip' key={value as string}>
                {value}
              </div>
            ))}
        </dl>
      )}
    </div>
  )
}

function ExampleHeader({ title, description, level = 2 }: {
  title: string
  description: ReactNode
  level?: 2 | 3
}) {
  const Heading = (level === 3 ? 'h3' : 'h2') as 'h2' | 'h3'

  return (
    <div className='example-header'>
      <div>
        <Heading>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [layout, setLayout] = useState<GalleryLayout>('grid')
  const layouts: Array<{ value: GalleryLayout; label: string }> = [
    { value: 'grid', label: 'Grid' },
    { value: 'justified', label: 'Justified' },
    { value: 'mosaic', label: 'Mosaic' },
    { value: 'carousel', label: 'Carousel' }
  ]

  return (
    <main className='playground'>
      <header className='site-header'>
        <a className='brand' href='#top'>
          react-pic-gallery <span>v2</span>
        </a>
        <nav aria-label='Primary navigation'>
          <a href='#examples'>Examples</a>
          <a href='./docs/'>Docs</a>
          <a href='https://github.com/marcelrsoub/react-pic-gallery'>GitHub</a>
        </nav>
      </header>

      <section className='intro' id='top'>
        <h1>Simple by default.<br /><em>Yours when needed.</em></h1>
        <p className='intro-copy'>
          A small, runtime-dependency-free image viewer with a clean API for adding your own UI.
        </p>
        <ul className='feature-strip' aria-label='Key features'>
          <li className='feature-strip__stat'>
            <strong>8.5 kB</strong>
            <span>gzipped, JS + CSS</span>
          </li>
          <li className='feature-strip__stat'>
            <strong>0</strong>
            <span>runtime dependencies</span>
          </li>
          <li>Native <code>&lt;dialog&gt;</code> lightbox</li>
          <li>Keyboard-first &amp; screen-reader ready</li>
          <li>Touch swipes, edge taps &amp; arrow keys</li>
          <li>Typed render callbacks</li>
          <li>CSS-variable theming</li>
        </ul>
      </section>

      <section className='install-section' id='install'>
        <div>
          <h2>Install</h2>
          <p>Bring the gallery into any React 18.3+ or React 19 project.</p>
        </div>
        <InstallCommand />
        <a href='./docs/getting-started/'>See the full quick start -&gt;</a>
      </section>

      <section className='demo-section demo-section--hero' id='examples'>
        <h2>Default gallery</h2>
        <div className='layout-switcher' role='group' aria-label='Gallery layout'>
          {layouts.map((option) => (
            <button
              type='button'
              key={option.value}
              aria-pressed={layout === option.value}
              onClick={() => setLayout(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className='gallery-frame gallery-frame--hero'>
          <PicGallery images={images} layout={layout} />
        </div>
        <CodeBlock
          code={layout === 'grid'
            ? basicSnippet
            : `<PicGallery images={images} layout="${layout}" />`}
        />
      </section>

      <section className='demo-section' id='customize'>
        <h2>Customize Your Lightbox</h2>
        <p className='section-intro'>
          Typed render callbacks —<code> renderActions</code>,<code> renderCaption</code>, and
          <code> renderControls</code> — add actions beside the counter, replace the caption, or
          own the entire control layer.
        </p>
        <div className='example-grid'>
          <section className='example'>
            <ExampleHeader
              title='Add an action'
              description='Add buttons without rebuilding the lightbox.'
              level={3}
            />
            <div className='gallery-frame'>
              <PicGallery
                images={images.slice(1, 4)}
                renderActions={(context) => <SaveAction {...context} />}
              />
            </div>
            <CodeBlock code={actionsSnippet} />
          </section>

          <section className='example'>
            <ExampleHeader
              title='Own the controls'
              description='Replace the toolbar while keeping the viewer behavior.'
              level={3}
            />
            <div className='gallery-frame'>
              <PicGallery
                images={images.slice(2, 8)}
                renderControls={(context) => <CustomControls {...context} />}
              />
            </div>
            <CodeBlock code={controlsSnippet} />
          </section>
        </div>

        <section className='example example--wide'>
          <ExampleHeader
            title='EXIF in the lightbox'
            level={3}
            description={
              <>
                Extend the image type with your own metadata and render it with
                <code> renderCaption</code> — the library stays out of the way.
              </>
            }
          />
          <div className='gallery-frame'>
            <PicGallery
              images={exifImages}
              renderCaption={(context) => <ExifCaption image={context.image} />}
            />
          </div>
          <CodeBlock code={exifSnippet} />
        </section>
      </section>

      <section className='docs-strip' id='docs'>
        <p>API reference, theming, and the complete v1 to v2 migration guide.</p>
        <a href='./docs/'>Read the docs <span aria-hidden='true'>-&gt;</span></a>
      </section>

      <footer className='site-footer'>
        <span>MIT license</span>
        <span>Made for React 18.3+ and 19</span>
      </footer>
    </main>
  )
}
