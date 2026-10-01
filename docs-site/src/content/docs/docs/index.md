---
title: Documentation
description: Learn how to install, configure, and extend react-pic-gallery.
sidebar:
  label: Overview
---

react-pic-gallery is a small React image gallery and lightbox with an accessible default experience and composable controls.

## Your first gallery

Start with [Quick start](./getting-started/) to install the package, import the styles, and render `PicGallery` with your images.

Want to try it first? The [interactive playground](/react-pic-gallery/) pairs working galleries with short, copyable examples.

## Make it yours

| Guide | What you’ll learn |
| --- | --- |
| [Customization](./customization/) | Add actions, captions, and custom controls; choose framed/bare appearance and preload behavior. |
| [Styling](./styling/) | Adjust frame, spacing, colors, and layout using CSS variables and classes. |
| [Accessibility](./accessibility/) | Understand keyboard navigation, focus management, and your responsibilities when adding custom UI. |

## Look up the details

- [API reference](./api/): component props, image types, render callbacks, and controlled lightbox state.
- [Migrating from v1](./migration-v1/): update an existing integration to the v2 API.

## Design principles

- The default integration is one component: `PicGallery`.
- Four layouts, responsive image sources, and framed/bare appearances are available without replacing the built-in structure.
- `Gallery` and `Lightbox` can be composed independently.
- Custom UI is added through typed render callbacks instead of copied internals.
- The package has no runtime dependency beyond React and React DOM.
