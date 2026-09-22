---
title: Migrating from v1
description: Move from the legacy imgList/options API to the smaller v2 API.
---

v2 is a deliberate breaking release. It removes the legacy options object and the external lightbox workaround in favor of three composable components.

## Data model

| v1 | v2 |
| --- | --- |
| `imgList` | `images` |
| `fullSrc` | `src` |
| `thumbnailSrc` | `thumbnailSrc` |
| `description` | `caption` |
| missing image alt text | required `alt` text |

Before:

```tsx
<PicGallery
  imgList={[{ fullSrc, thumbnailSrc }]}
  options={{ picsPerRow: 4 }}
/>
```

After:

```tsx
<PicGallery
  images={[{ src: fullSrc, thumbnailSrc, alt: 'Description' }]}
  columns={4}
/>
```

## Options become props

| v1 | v2 |
| --- | --- |
| `options.picsPerRow` | `columns` |
| `options.rowHeight` | `rowHeight` |
| `options.hidePagination` | `showNavigation={false}` |
| `customLoadComponent` | CSS overrides or your own image composition |

## Custom content

`topCustomContent` and `bottomCustomContent` are replaced by typed render callbacks:

- Use `renderActions` to add buttons to the default toolbar.
- Use `renderCaption` to replace caption markup.
- Use `renderControls` to replace the complete control layer.

## External lightboxes

Remove `externalLightbox` and `setExtLightboxChildren`. When application state should own the selected image, compose `Gallery` and controlled `Lightbox`:

```tsx
const [index, setIndex] = useState<number | null>(null)

<Gallery images={images} onImageClick={setIndex} />
<Lightbox images={images} index={index} onIndexChange={setIndex} />
```

## Removed dependencies and packaging

- Pinch zoom and `react-zoom-pan-pinch` are removed.
- Runtime spinner stylesheet injection is removed.
- Jest and `ts-jest` are replaced with Vitest.
- The package is ESM-only in v2.
- Import `react-pic-gallery/styles.css` explicitly.
