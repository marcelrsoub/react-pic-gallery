---
title: API reference
description: Props and types exported by react-pic-gallery.
---

## `GalleryImage`

```ts
type GalleryImage = {
  id?: string
  src: string
  thumbnailSrc?: string
  alt: string
  caption?: ReactNode
  /** Recommended for justified layouts; if omitted, they use a 3:2 ratio. */
  width?: number
  height?: number
}
```

## `PicGallery`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `readonly T[]` | required | Images to display. |
| `layout` | `'grid' \| 'justified' \| 'mosaic'` | `'grid'` | Gallery presentation. |
| `columns` | `number` | `3` | Fixed grid column count; only applies to `grid`. |
| `rowHeight` | `CSSProperties['height']` | CSS default | Grid tile height, mosaic base row height, or justified target row height. Numbers are pixels. |
| `className` | `string` | — | Class on the gallery wrapper. |
| `galleryClassName` | `string` | — | Class on the selected gallery layout container. |
| `renderActions` | `LightboxRenderer<T>` | — | Adds actions to the default toolbar. |
| `renderCaption` | `LightboxRenderer<T>` | image caption | Replaces the caption. |
| `renderControls` | `LightboxRenderer<T>` | — | Replaces the complete default control layer. |
| `showCounter` | `boolean` | `true` | Shows the current image count. |
| `showNavigation` | `boolean` | `true` | Shows previous/next controls. |

## `Gallery`

`Gallery` accepts `images`, `onImageClick`, `layout`, `columns`, `rowHeight`, `className`, and `style`. It renders only the thumbnail presentation; its layout defaults to the three-column grid.

For `justified`, `GalleryImage.width` and `height` are recommended but optional. When either is missing or not positive, the layout assumes a 3:2 aspect ratio. Supplying accurate dimensions gives the most faithful proportions and reduces layout shifts.

## `Lightbox`

`Lightbox` accepts:

- `images: readonly T[]`
- `index: number | null`
- `onIndexChange: (index: number | null) => void`
- `renderActions`, `renderCaption`, and `renderControls`
- `showCounter`, `showNavigation`, and `className`

`null` means that the lightbox is closed.

## `LightboxContext<T>`

Render callbacks receive the current `image`, zero-based `index`, `count`, `close`, `next`, `previous`, `canGoNext`, and `canGoPrevious`.
