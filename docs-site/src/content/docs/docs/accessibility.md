---
title: Accessibility
description: Understand the built-in keyboard, focus, and image semantics.
---

Accessibility is part of the default component rather than an optional wrapper.

## Images and controls

- Every image requires useful `alt` text.
- Each thumbnail is a keyboard-focusable button.
- Layouts preserve source order and a single roving tab stop; irregular rows and mosaics use tile position for Up/Down movement.
- Controls have accessible labels independent of their visual icons.
- Loading and failed-image states expose status information.

## Lightbox behavior

- The lightbox uses the native modal `<dialog>` element, which exposes an `aria-modal` dialog and makes the page behind it inert.
- Focus moves into the viewer when it opens and returns to the triggering thumbnail when it closes.
- Tab focus is kept inside the viewer.
- `Escape` closes the viewer.
- Left and right arrow keys navigate between images.
- Backdrop clicks close the viewer without making image content clickable by accident.
- Body scrolling is restored when the viewer closes or unmounts.

The native modal behavior targets modern browsers: Chrome 37+, Edge 79+, Firefox 98+, and Safari/iOS 15.4+. The package does not ship a dialog polyfill.

## Carousel behavior

- The inline carousel is a labelled `region` with `aria-roledescription="carousel"`.
- It uses the same polite live-region announcement as the lightbox: “alt, image n of total.”
- Previous/next controls retain their accessible labels.

## Custom controls

When using `renderControls`, include a clearly labelled close button. The library still owns the dialog, focus containment, and image semantics, but your custom UI owns the actions the user can see.

```tsx
renderControls={({ close }) => (
  <button type='button' onClick={close}>
    Close viewer
  </button>
)}
```
