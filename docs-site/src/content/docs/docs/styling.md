---
title: Styling and theming
description: Customize the gallery without replacing its structure or accessibility behavior.
---

Import the default stylesheet once:

```tsx
import 'react-pic-gallery/styles.css'
```

The library uses namespaced classes and CSS variables. Set gallery variables on the `PicGallery` wrapper or on a standalone `Gallery`; the inner gallery layout inherits wrapper customization. Because the lightbox is rendered in a portal, theme lightbox variables globally or on `.react-pic-gallery__lightbox`.

```css
.portfolio-gallery {
  --gallery-background: #111a24;
  --gallery-padding: 0.65rem;
  --gallery-border: 1px solid rgba(148, 163, 184, 0.18);
  --gallery-frame-radius: 1.1rem;
  --gallery-accent: #ff7a59;
}

.react-pic-gallery__lightbox {
  --gallery-overlay: rgba(10, 10, 14, 0.98);
  --gallery-control-size: 3rem;
}
```

```tsx
<PicGallery className='portfolio-gallery' images={images} />
<PicGallery className='portfolio-gallery' images={images} appearance='bare' />
```

The default appearance is `framed`. The `bare` appearance removes the gallery's background, outer padding, border, and outer radius. Tile gap (`--gallery-gap`) and tile radius (`--gallery-radius`) remain in effect. The frame properties are:

| Variable | Default | Purpose |
| --- | --- | --- |
| `--gallery-background` | `#111a24` | Framed gallery surface color. |
| `--gallery-padding` | `0.65rem` | Space inside the frame around the tiles. |
| `--gallery-border` | `1px solid rgba(148, 163, 184, 0.18)` | Frame border. |
| `--gallery-frame-radius` | `1.1rem` | Outer frame corner radius; separate from tile radius. |

Useful variables include:

| Variable | Purpose |
| --- | --- |
| `--gallery-gap` | Space between gallery tiles. |
| `--gallery-radius` | Tile corner radius. |
| `--gallery-row-height` | Tile/base mosaic row height, or target justified-row height, when `rowHeight` is not supplied. |
| `--gallery-accent` | Focus ring, loader, and interactive accent color. |
| `--gallery-overlay` | Lightbox backdrop color. |
| `--gallery-control-size` | Close and navigation target size. |
| `--gallery-carousel-height` | Height of the inline carousel (defaults to `24rem`, or `14rem` at screen widths up to `600px`). |
| `--gallery-motion` | Transition and animation duration. |
| `--gallery-background` | Framed gallery surface color. |
| `--gallery-padding` | Space between the frame and its tiles. |
| `--gallery-border` | Framed gallery border. |
| `--gallery-frame-radius` | Outer frame radius. |

## Stable class names

All classes begin with `react-pic-gallery__`. The main extension points are:

- `.react-pic-gallery__grid`
- `.react-pic-gallery__gallery--framed` and `.react-pic-gallery__gallery--bare`
- `.react-pic-gallery__gallery--justified` and `.react-pic-gallery__tile--justified`
- `.react-pic-gallery__gallery--mosaic` and `.react-pic-gallery__mosaic-group`
- `.react-pic-gallery__carousel`
- `.react-pic-gallery__tile`
- `.react-pic-gallery__lightbox`
- `.react-pic-gallery__toolbar`
- `.react-pic-gallery__control`
- `.react-pic-gallery__caption`

Prefer variables and render callbacks before overriding layout classes. This keeps the built-in keyboard and responsive behavior intact.

## Reduced motion

The default stylesheet respects `prefers-reduced-motion: reduce`. If your application has a stronger motion policy, set:

```css
:root {
  --gallery-motion: 0ms;
}
```
