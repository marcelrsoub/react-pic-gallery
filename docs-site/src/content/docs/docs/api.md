---
title: API reference
description: Props and types exported by react-pic-gallery.
---

## `GalleryImage`

```ts
type GalleryImage = {
  id?: string
  src: string
  srcSet?: string
  sizes?: string
  thumbnailSrc?: string
  thumbnailSrcSet?: string
  thumbnailSizes?: string
  alt: string
  caption?: ReactNode
  /** Recommended for justified layouts; if omitted, they use a 3:2 ratio. */
  width?: number
  height?: number
}
```

The full-size source family (`src`, `srcSet`, `sizes`) is used by the lightbox. Thumbnails use the dedicated thumbnail family when either `thumbnailSrc` or `thumbnailSrcSet` is supplied; otherwise they use the full-size family. If only `thumbnailSrcSet` is given, `src` is its fallback URL. All source selection uses native responsive image attributes.

## `GalleryAppearance`

```ts
type GalleryAppearance = 'framed' | 'bare'
```

`GalleryAppearance` is exported from the package. Both `Gallery` and `PicGallery` default to `'framed'`. `'bare'` removes the outer frame surface but preserves tile spacing and tile corner radii.

## `PicGallery`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `readonly T[]` | required | Images to display. |
| `layout` | `'grid' \| 'justified' \| 'mosaic' \| 'carousel'` | `'grid'` | Gallery presentation. The carousel shows one image at a time with bounded previous/next navigation; `columns` and `rowHeight` do not apply to it. |
| `appearance` | `GalleryAppearance` | `'framed'` | Outer gallery surface. Set to `'bare'` to remove it. |
| `columns` | `number` | `3` | Fixed grid column count; only applies to `grid`. |
| `rowHeight` | `CSSProperties['height']` | CSS default | Grid tile height, mosaic base row height, or justified target row height. Numbers are pixels. |
| `preloadAdjacent` | `boolean` | `true` | Preload immediate previous/next full-size images while the lightbox is open or inline carousel is mounted. |
| `className` | `string` | None | Class on the gallery wrapper. |
| `galleryClassName` | `string` | None | Class on the selected gallery layout container. |
| `renderActions` | `LightboxRenderer<T>` | None | Adds actions to the default toolbar. |
| `renderCaption` | `LightboxRenderer<T>` | image caption | Replaces the lightbox caption, and the carousel caption when `layout="carousel"`. Uses the same renderer context; `context.close` is a no-op in the carousel. |
| `renderControls` | `LightboxRenderer<T>` | None | Replaces the complete default control layer. |
| `showCounter` | `boolean` | `true` | Shows the current image count in the lightbox and carousel. |
| `showNavigation` | `boolean` | `true` | Shows previous/next controls in the lightbox and carousel. |

## `Gallery`

`Gallery` accepts `images`, `onImageClick`, `layout`, `appearance`, `columns`, `rowHeight`, `preloadAdjacent`, `className`, `style`, `renderCaption`, `showCounter`, and `showNavigation`. Its layout defaults to the three-column grid and its appearance defaults to `'framed'`. The `carousel` layout displays one image at a time, starting at the first image, with bounded previous/next navigation, touch swipe, arrow-key navigation when the carousel region has focus, and edge-tap zones on coarse-pointer/small screens. `columns` and `rowHeight` do not apply to the carousel. Clicking its displayed image calls `onImageClick(activeIndex)`; without an `onImageClick` handler, clicking does nothing. With `PicGallery`, this opens the lightbox at that image, as thumbnail clicks do in the other layouts. `preloadAdjacent` defaults to `true` and only affects `Gallery` when the carousel layout is selected.

For `justified`, `GalleryImage.width` and `height` are recommended but optional. When either is missing or not positive, the layout assumes a 3:2 aspect ratio. Supplying accurate dimensions gives the most faithful proportions and reduces layout shifts.

## `Lightbox`

`Lightbox` accepts:

- `images: readonly T[]`
- `index: number | null`
- `onIndexChange: (index: number | null) => void`
- `renderActions`, `renderCaption`, and `renderControls`
- `showCounter`, `showNavigation`, `preloadAdjacent`, and `className`

`null` means that the lightbox is closed.

`preloadAdjacent` defaults to `true`. While the lightbox is open or carousel is mounted, the shared preloader considers only the immediately previous and next full-size responsive source families. Requests use low fetch priority where supported, and at most 32 entries are tracked. Set `preloadAdjacent={false}` on `PicGallery`, `Gallery` (carousel only), or `Lightbox` to opt out. Preloading does not guarantee a later cache hit: browser cache policy, response headers, and network conditions still apply.

## `LightboxContext<T>`

Render callbacks receive the current `image`, zero-based `index`, `count`, `close`, `next`, `previous`, `canGoNext`, and `canGoPrevious`.
