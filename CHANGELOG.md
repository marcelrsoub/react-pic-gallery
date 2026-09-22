# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] (2026-09-22)

This patch release polishes the lightbox, adds keyboard grid navigation, and refreshes the demo site.

### Added

- Arrow-key navigation in the thumbnail grid with a roving tabindex (Tab once, then Arrow/Home/End keys; Enter opens).
- Instagram-Stories-style edge taps on touch screens: tap the left or right edge of the lightbox image to navigate; visible navigation buttons are hidden on small screens.
- Telemetry-free hero features strip and an EXIF-in-the-lightbox customization example in the demo.
- `server.watch` configuration so the Vite dev server starts reliably on hosts with a low inotify limit.

### Fixed

- Lightbox images no longer overflow the viewport on short viewports (landscape phones and short desktop windows).
- Mobile lightbox now uses dynamic viewport units (`dvh`) so browser URL bars no longer crop the image; landscape phones gain extra vertical space through compressed chrome and full-width images.
- Removed the hover translate effect on lightbox controls; hover now only changes the background.

### Removed

- Pinch zoom and pan from the lightbox in favor of native browser zoom behavior.

## [2.0.0] (2026-09-22)

This is a breaking release focused on a smaller API and a modern React toolchain.

### Added

- React 18.3 and React 19 support.
- `Gallery`, `Lightbox`, and `PicGallery` named exports.
- Typed render callbacks for actions, captions, and complete control replacement.
- Accessible keyboard controls, focus restoration, reduced-motion support, and image loading/error states.
- Native modal lightbox behavior with touch swipes, bounded pinch zoom, and one-finger panning while zoomed.
- Responsive default styling with CSS variables and an ESM package export.
- Updated GitHub Pages demo with a v1 to v2 migration guide.

### Removed

- The legacy `options` object and external lightbox element workaround.
- The `react-zoom-pan-pinch` dependency and legacy external lightbox workaround.
- Runtime stylesheet injection and the old Jest toolchain.

### [1.5.16](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.15...v1.5.16) (2022-05-29)

### [1.5.15](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.14...v1.5.15) (2022-03-23)

### [1.5.14](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.13...v1.5.14) (2022-03-23)

### [1.5.13](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.12...v1.5.13) (2022-03-23)

### [1.5.12](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.11...v1.5.12) (2022-03-23)

### [1.5.11](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.10...v1.5.11) (2022-03-23)

### [1.5.10](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.9...v1.5.10) (2021-12-30)

### [1.5.9](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.8...v1.5.9) (2021-12-22)

### [1.5.8](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.5.7...v1.5.8) (2021-12-16)

### [1.5.7](https://github.com/marcelrsoub/react-pic-gallery/compare/v1.3.9...v1.5.7) (2021-12-16)
