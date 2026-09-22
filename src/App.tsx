import { useState } from 'react'
import { PicGallery, type GalleryImage, type LightboxContext } from './lib'
import './App.css'

const images: GalleryImage[] = [
  {
    id: 'coast',
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80',
    alt: 'A calm blue coast under a bright sky',
    caption: 'Blue hour on the coast'
  },
  {
    id: 'forest',
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80',
    alt: 'Sunlight through a dense green forest',
    caption: 'A quiet path through the forest'
  },
  {
    id: 'mountain',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
    alt: 'Snow-capped mountains reflected in a lake',
    caption: 'Morning light in the mountains'
  },
  {
    id: 'desert',
    src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=700&q=80',
    alt: 'Layered desert dunes under a pale sky',
    caption: 'Wind-shaped dunes'
  },
  {
    id: 'lake',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80',
    alt: 'A mountain lake surrounded by green hills',
    caption: 'Still water, early morning'
  },
  {
    id: 'cliffs',
    src: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=700&q=80',
    alt: 'Dark cliffs beside a deep blue sea',
    caption: 'Where the land meets the sea'
  },
  {
    id: 'canyon',
    src: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=700&q=80',
    alt: 'Red canyon walls beneath a wide sky',
    caption: 'Layers of red rock'
  },
  {
    id: 'waterfall',
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=700&q=80',
    alt: 'A waterfall flowing through a green valley',
    caption: 'A clear mountain waterfall'
  },
  {
    id: 'meadow',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
    alt: 'A grassy meadow beneath distant mountains',
    caption: 'Open ground beneath the peaks'
  }
]

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

function CodeBlock({ code }: { code: string }) {
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
        <span className='code-block__language'>tsx</span>
        <button type='button' onClick={copyCode} disabled={!canCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
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

function ExampleHeader({ title, description }: {
  title: string
  description: string
}) {
  return (
    <div className='example-header'>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function App() {
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
      </section>

      <section className='demo-section demo-section--hero' id='examples'>
        <h2>Default gallery</h2>
        <div className='gallery-frame gallery-frame--hero'>
          <PicGallery images={images} />
        </div>
        <CodeBlock code={basicSnippet} />
      </section>

      <section className='install-section' id='install'>
        <div>
          <h2>Install</h2>
          <p>Bring the gallery into any React 18.3+ or React 19 project.</p>
        </div>
        <CodeBlock code='npm install react-pic-gallery' />
        <a href='./docs/getting-started/'>Using pnpm, Yarn, or Bun? See every install option -&gt;</a>
      </section>

      <div className='example-grid'>
        <section className='demo-section example'>
          <ExampleHeader
            title='Add an action'
            description='Add buttons without rebuilding the lightbox.'
          />
          <div className='gallery-frame'>
            <PicGallery
              images={images.slice(1, 4)}
              renderActions={(context) => <SaveAction {...context} />}
            />
          </div>
          <CodeBlock code={actionsSnippet} />
        </section>

        <section className='demo-section example'>
          <ExampleHeader
            title='Own the controls'
            description='Replace the toolbar while keeping the viewer behavior.'
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
