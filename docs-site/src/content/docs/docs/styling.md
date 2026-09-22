---
title: Styling and theming
description: Customize the gallery without replacing its structure or accessibility behavior.
---

Import the default stylesheet once:

```tsx
import 'react-pic-gallery/styles.css'
```

The library uses namespaced classes and CSS variables. Because the lightbox is rendered in a portal, theme lightbox variables globally or on `.react-pic-gallery__lightbox`.

```css
:root,
.react-pic-gallery__lightbox {
  --gallery-accent: #ff7a59;
  --gallery-overlay: rgba(10, 10, 14, 0.98);
  --gallery-control-size: 3rem;
}
```

Useful variables include:

| Variable | Purpose |
| --- | --- |
| `--gallery-gap` | Space between gallery tiles. |
| `--gallery-radius` | Tile corner radius. |
| `--gallery-row-height` | Thumbnail height when `rowHeight` is not supplied. |
| `--gallery-accent` | Focus ring, loader, and interactive accent color. |
| `--gallery-overlay` | Lightbox backdrop color. |
| `--gallery-control-size` | Close and navigation target size. |
| `--gallery-motion` | Transition and animation duration. |

## Stable class names

All classes begin with `react-pic-gallery__`. The main extension points are:

- `.react-pic-gallery__grid`
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
