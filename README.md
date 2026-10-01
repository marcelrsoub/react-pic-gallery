# react-pic-gallery

Small, accessible React image gallery and lightbox with a polished default UI and typed escape hatches for custom controls.

[![NPM](https://img.shields.io/npm/v/react-pic-gallery.svg)](https://www.npmjs.com/package/react-pic-gallery)
[![Minified + gzip size](https://badgen.net/static/minified%20%2B%20gzip/9.6%20KB/blue)](https://bundlephobia.com/package/react-pic-gallery)

[Live playground and docs](https://marcelrsoub.github.io/react-pic-gallery/)

![react-pic-gallery displaying a three-column gallery of landscape photos](screenshot.png)

## Install

```bash
npm install react-pic-gallery
```

```bash
pnpm add react-pic-gallery
yarn add react-pic-gallery
bun add react-pic-gallery
```

React 18.3+ and React 19 are supported. The package has no runtime dependencies; React is a peer dependency. The built JavaScript and CSS together are about **9.6 KB gzipped** (7.20 KB JS + 2.40 KB CSS).

## Quick start

```tsx
import { PicGallery } from 'react-pic-gallery'
import 'react-pic-gallery/styles.css'

const images = [
  {
    src: 'https://example.com/mountain.jpg',
    alt: 'A mountain reflected in a lake',
    caption: 'Morning at the lake'
  }
]

export function App() {
  return <PicGallery images={images} />
}
```

`src` and `alt` are required; `id`, `caption`, `width`, and `height` are optional. Image objects can include application-specific fields; those remain available in renderer callbacks when using TypeScript generics.

## Features

- **Tiny by design**: no runtime dependencies, no context providers, no polyfills; ~9.6 KB gzipped total.
- **Simple by default**: one component, one stylesheet import, sensible accessible defaults.
- **Yours when needed**: typed `renderActions`, `renderCaption`, and `renderControls` callbacks add custom UI without rebuilding the lightbox.
- **Accessible**: native modal `<dialog>`, focus containment and restoration, Escape to close, screen-reader announcements, `prefers-reduced-motion` support.
- **Keyboard and touch friendly**: roving-focus grid navigation, arrow keys in the lightbox, swipe and edge taps on touch.
- **Themeable**: namespaced classes and CSS variables, all optional with sensible defaults.
- **Four layouts**: uniform grid, proportional justified rows, editorial mosaic, or inline carousel.

## Documentation

Full guides, the API reference, and live examples live on the docs site:

- [Quick start](https://marcelrsoub.github.io/react-pic-gallery/docs/getting-started/)
- [Responsive images](https://marcelrsoub.github.io/react-pic-gallery/docs/getting-started/#responsive-images)
- [Layouts and appearance](https://marcelrsoub.github.io/react-pic-gallery/docs/getting-started/#choose-a-layout)
- [Custom UI and standalone components](https://marcelrsoub.github.io/react-pic-gallery/docs/customization/)
- [Styling and theming](https://marcelrsoub.github.io/react-pic-gallery/docs/styling/)
- [Accessibility](https://marcelrsoub.github.io/react-pic-gallery/docs/accessibility/)
- [API reference](https://marcelrsoub.github.io/react-pic-gallery/docs/api/)
- [Migrating from v1](https://marcelrsoub.github.io/react-pic-gallery/docs/migration-v1/)

## Development

Node 22.12+ is required for the Astro documentation workflow.

```bash
npm install
npm run dev
npm run dev:library
npm test
npm run test:visual
npm run typecheck
npm run build
npm run build:docs
npm pack --dry-run
```

`npm run dev` starts the Astro playground and docs site. `npm run dev:library` starts the standalone Vite library demo. Publishing runs the package build automatically through `prepack`.

Visual regression tests render a deterministic fixture across every layout, the standalone components, and the lightbox, then diff screenshots and layout metrics against committed baselines. `npm run test:visual` checks against the baselines and `npm run test:visual:update` regenerates them. The harness drives a real Chromium over the DevTools protocol; see `scripts/visual-regression.mjs` for the `VISUAL_CDP` and `VISUAL_BASE_HOST` options.

## License

MIT © [marcelrsoub](https://github.com/marcelrsoub)
