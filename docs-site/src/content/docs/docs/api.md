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
  width?: number
  height?: number
}
```

## `PicGallery`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `readonly T[]` | required | Images to display. |
| `columns` | `number` | responsive | Fixed column count. |
| `rowHeight` | `CSSProperties['height']` | CSS default | Thumbnail height. Numbers are pixels. |
| `className` | `string` | — | Class on the gallery wrapper. |
| `galleryClassName` | `string` | — | Class on the thumbnail grid. |
| `renderActions` | `LightboxRenderer<T>` | — | Adds actions to the default toolbar. |
| `renderCaption` | `LightboxRenderer<T>` | image caption | Replaces the caption. |
| `renderControls` | `LightboxRenderer<T>` | — | Replaces the complete default control layer. |
| `showCounter` | `boolean` | `true` | Shows the current image count. |
| `showNavigation` | `boolean` | `true` | Shows previous/next controls. |

## `Gallery`

`Gallery` accepts `images`, `onImageClick`, `columns`, `rowHeight`, `className`, and `style`. It renders only the responsive thumbnail grid.

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
