---
title: Customization
description: Add actions, replace captions, or own the entire lightbox control layer.
---

## Add an action

`renderActions` adds content beside the default counter and close button. The callback receives the current image and navigation helpers.

```tsx
<PicGallery
  images={images}
  renderActions={({ image }) => (
    <button type='button' onClick={() => saveImage(image)}>
      Save
    </button>
  )}
/>
```

## Replace the caption

Use `renderCaption` when a caption needs links, metadata, or application-specific markup.

```tsx
<PicGallery
  images={images}
  renderCaption={({ image, index, count }) => (
    <span>
      {image.caption} · {index + 1} of {count}
    </span>
  )}
/>
```

## Replace the controls

`renderControls` replaces the complete default control layer. Your renderer should include a close action and any navigation actions you want to expose.

```tsx
<PicGallery
  images={images}
  renderControls={({ close, next, previous }) => (
    <div>
      <button type='button' onClick={previous}>Back</button>
      <button type='button' onClick={next}>Next</button>
      <button type='button' onClick={close}>Close</button>
    </div>
  )}
/>
```

When `renderControls` is active, the library does not render its default counter, close button, or navigation buttons. Image rendering, keyboard behavior, focus containment, and scroll locking remain handled by `Lightbox`.

## Use the components separately

Use the controlled `Lightbox` when another part of your application owns the selected image.

```tsx
import { useState } from 'react'
import { Gallery, Lightbox } from 'react-pic-gallery'

export function Viewer({ images }) {
  const [index, setIndex] = useState<number | null>(null)

  return (
    <>
      <Gallery images={images} onImageClick={setIndex} />
      <Lightbox images={images} index={index} onIndexChange={setIndex} />
    </>
  )
}
```

## Choose an appearance and preload policy

`PicGallery` and `Gallery` use the `framed` appearance by default. Choose `bare` to remove the outer surface without changing tile spacing or tile radius:

```tsx
<PicGallery images={images} appearance='bare' />
```

Adjacent full-size responsive images are preloaded by default while the lightbox is open or the inline carousel is mounted. Set `preloadAdjacent={false}` on `PicGallery`, `Lightbox`, or a carousel `Gallery` to opt out. Standalone `Gallery` only preloads in its carousel layout.
