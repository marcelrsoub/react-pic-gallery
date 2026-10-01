---
title: Styling and theming
description: Customize the gallery without replacing its structure or accessibility behavior.
---

Import the default stylesheet once:

```tsx
import 'react-pic-gallery/styles.css'
```

The library uses namespaced classes and CSS variables. **No variable is required** — the stylesheet ships sensible defaults for every one — so you only override what you want to change.

Minimal override: change a single value.

```css
.brand-gallery {
  --gallery-accent: #ff7a59;
}
```

```tsx
<PicGallery className='brand-gallery' images={images} />
```

The default appearance is `framed`. Set `appearance='bare'` to remove the frame surface (background, outer padding, border, and outer radius) while keeping the tile gap (`--gallery-gap`) and tile radius (`--gallery-radius`).

## Variable scope

Set gallery variables on the `PicGallery` wrapper (or a standalone `Gallery`); the inner layout container inherits them. The lightbox is rendered in a portal outside the wrapper, so lightbox variables must be set on `.react-pic-gallery__lightbox` or globally on `:root`.

## Variables

Every variable below is optional and falls back to the listed default.

### Gallery

| Variable | Default | Purpose |
| --- | --- | --- |
| `--gallery-background` | `#111a24` | Framed gallery surface color. |
| `--gallery-padding` | `0.65rem` | Space inside the frame around the tiles. |
| `--gallery-border` | `1px solid rgba(148, 163, 184, 0.18)` | Frame border. |
| `--gallery-frame-radius` | `1.1rem` | Outer frame corner radius; separate from tile radius. |
| `--gallery-gap` | `0.75rem` | Space between gallery tiles. |
| `--gallery-radius` | `1rem` | Tile corner radius. |
| `--gallery-row-height` | `12rem` | Tile/base mosaic row height, or target justified-row height, when `rowHeight` is not supplied. |
| `--gallery-accent` | `#9ef01a` | Focus ring, loader, and interactive accent color. |
| `--gallery-carousel-height` | `24rem` | Height of the inline carousel (`14rem` at screen widths up to `600px`). |
| `--gallery-motion` | `180ms` | Transition and animation duration. |

### Lightbox

Set these on `.react-pic-gallery__lightbox` or `:root`, because the lightbox is portaled.

| Variable | Default | Purpose |
| --- | --- | --- |
| `--gallery-overlay` | `rgba(7, 11, 16, 0.94)` | Lightbox backdrop color. |
| `--gallery-control-size` | `2.75rem` | Close and navigation target size. |

`--gallery-accent` and `--gallery-motion` also affect the lightbox. Set them on `:root` (or on both the wrapper and `.react-pic-gallery__lightbox`) when you want the change to apply everywhere.

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
