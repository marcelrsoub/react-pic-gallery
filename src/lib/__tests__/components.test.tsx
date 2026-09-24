/// <reference types="@testing-library/jest-dom" />

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Gallery, Lightbox, PicGallery } from '../index'
import { Image as GalleryImageElement } from '../Image'
import type { GalleryImage } from '../types'

const images: GalleryImage[] = [
  {
    id: 'one',
    src: 'one-large.jpg',
    thumbnailSrc: 'one-thumb.jpg',
    alt: 'First image',
    caption: 'First caption'
  },
  {
    id: 'two',
    src: 'two-large.jpg',
    thumbnailSrc: 'two-thumb.jpg',
    alt: 'Second image',
    caption: 'Second caption'
  }
]

function dispatchDialogCancel(dialog: HTMLElement) {
  const event = new Event('cancel', { bubbles: false, cancelable: true })
  fireEvent(dialog, event)
  return event
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Gallery', () => {
  it('renders an accessible button for every image', () => {
    render(<Gallery images={images} />)

    expect(screen.getByTestId('react-pic-gallery-grid').children).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Open First image' })).toBeVisible()
    expect(screen.getByAltText('First image')).toHaveAttribute('src', 'one-thumb.jpg')
  })

  it('hides the loader when an image completed before hydration', async () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(640)

    render(<GalleryImageElement src='cached.jpg' alt='Cached image' />)

    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    )
  })

  it('navigates the grid with arrow keys using a roving tabindex', () => {
    const threeByThree: GalleryImage[] = [
      { src: '1.jpg', alt: 'Image 1' },
      { src: '2.jpg', alt: 'Image 2' },
      { src: '3.jpg', alt: 'Image 3' },
      { src: '4.jpg', alt: 'Image 4' },
      { src: '5.jpg', alt: 'Image 5' },
      { src: '6.jpg', alt: 'Image 6' }
    ]
    const onImageClick = vi.fn()
    render(<Gallery images={threeByThree} onImageClick={onImageClick} />)

    const tile = (alt: string) =>
      screen.getByRole('button', { name: `Open ${alt}` }) as HTMLButtonElement

    tile('Image 1').focus()
    expect(tile('Image 1')).toHaveFocus()
    expect(tile('Image 1')).toHaveAttribute('tabindex', '0')
    expect(tile('Image 2')).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(tile('Image 1'), { key: 'ArrowRight' })
    expect(tile('Image 2')).toHaveFocus()

    fireEvent.keyDown(tile('Image 2'), { key: 'ArrowDown' })
    expect(tile('Image 5')).toHaveFocus()

    fireEvent.keyDown(tile('Image 5'), { key: 'ArrowLeft' })
    expect(tile('Image 4')).toHaveFocus()

    fireEvent.keyDown(tile('Image 4'), { key: 'ArrowUp' })
    expect(tile('Image 1')).toHaveFocus()

    fireEvent.keyDown(tile('Image 1'), { key: 'ArrowLeft' })
    expect(tile('Image 1')).toHaveFocus()

    fireEvent.keyDown(tile('Image 1'), { key: 'ArrowUp' })
    expect(tile('Image 1')).toHaveFocus()

    fireEvent.keyDown(tile('Image 1'), { key: 'End' })
    expect(tile('Image 6')).toHaveFocus()

    fireEvent.keyDown(tile('Image 6'), { key: 'ArrowRight' })
    expect(tile('Image 6')).toHaveFocus()

    fireEvent.keyDown(tile('Image 6'), { key: 'Home' })
    expect(tile('Image 1')).toHaveFocus()
  })

  it('only exposes one tile in the tab order', () => {
    render(<Gallery images={images} onImageClick={vi.fn()} />)

    const tiles = screen.getAllByRole('button')
    expect(tiles[0]).toHaveAttribute('tabindex', '0')
    expect(tiles[1]).toHaveAttribute('tabindex', '-1')
  })

  it('updates the roving tabindex after opening an image', () => {
    const onImageClick = vi.fn()
    render(<Gallery images={images} onImageClick={onImageClick} />)

    const secondTile = screen.getByRole('button', { name: 'Open Second image' })
    fireEvent.click(secondTile)

    expect(onImageClick).toHaveBeenCalledWith(1)
    expect(secondTile).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'Open First image' })).toHaveAttribute(
      'tabindex',
      '-1'
    )
  })

  it('renders justified rows with every image and supports optional dimensions', () => {
    const mixedImages: GalleryImage[] = [
      { src: 'wide.jpg', alt: 'Wide image', width: 1600, height: 900 },
      { src: 'fallback.jpg', alt: 'Unknown dimensions' },
      { src: 'portrait.jpg', alt: 'Portrait image', width: 800, height: 1200 }
    ]
    const { container } = render(
      <Gallery images={mixedImages} layout='justified' onImageClick={vi.fn()} />
    )

    expect(container.querySelector('[data-layout="justified"]')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(3)
    const tile = container.querySelector('.react-pic-gallery__tile--justified') as HTMLButtonElement
    expect(tile.style.width).toMatch(/px$/)
    expect(tile.style.height).toMatch(/px$/)
  })

  it('keeps justified tile nodes and keyboard focus stable when rows reflow', () => {
    const sixImages = Array.from({ length: 6 }, (_, index) => ({
      src: `${index}.jpg`,
      alt: `Reflow ${index + 1}`,
      width: 1500,
      height: 1000
    }))
    const { container, rerender } = render(
      <Gallery
        images={sixImages}
        layout='justified'
        rowHeight={180}
        onImageClick={vi.fn()}
      />
    )
    const gallery = container.querySelector('[data-layout="justified"]')!
    gallery.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 800, bottom: 0, width: 800, height: 0,
      x: 0, y: 0, toJSON: () => ({})
    }) as DOMRect
    const firstTile = screen.getByRole('button', { name: 'Open Reflow 1' })
    firstTile.focus()

    rerender(
      <Gallery
        images={sixImages}
        layout='justified'
        rowHeight={100}
        onImageClick={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Open Reflow 1' })).toBe(firstTile)
    expect(firstTile).toHaveFocus()
  })

  it('preserves source order and gracefully renders partial mosaic groups', () => {
    const fiveImages = Array.from({ length: 5 }, (_, index) => ({
      src: `${index}.jpg`,
      alt: `Mosaic ${index + 1}`
    }))
    const { container } = render(
      <Gallery images={fiveImages} layout='mosaic' onImageClick={vi.fn()} />
    )

    expect(container.querySelectorAll('.react-pic-gallery__mosaic-group')).toHaveLength(2)
    expect(container.querySelector('.react-pic-gallery__mosaic-group--count-2')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Open Mosaic/ }).map((button) => button.getAttribute('aria-label'))).toEqual([
      'Open Mosaic 1',
      'Open Mosaic 2',
      'Open Mosaic 3',
      'Open Mosaic 4',
      'Open Mosaic 5'
    ])
  })

  it('alternates mosaic shapes without reversing image order', () => {
    const sixImages = Array.from({ length: 6 }, (_, index) => ({
      src: `${index}.jpg`,
      alt: `Ordered ${index + 1}`
    }))
    const { container } = render(
      <Gallery images={sixImages} layout='mosaic' onImageClick={vi.fn()} />
    )
    const groups = container.querySelectorAll('.react-pic-gallery__mosaic-group')

    expect(groups[0]).toHaveClass('react-pic-gallery__mosaic-group--left')
    expect(groups[1]).toHaveClass('react-pic-gallery__mosaic-group--top')
    expect(
      [...container.querySelectorAll('.react-pic-gallery__tile')].map((tile) =>
        tile.getAttribute('aria-label')
      )
    ).toEqual([
      'Open Ordered 1',
      'Open Ordered 2',
      'Open Ordered 3',
      'Open Ordered 4',
      'Open Ordered 5',
      'Open Ordered 6'
    ])
  })

  it('uses tile geometry for vertical navigation in irregular layouts', () => {
    const threeImages: GalleryImage[] = [
      { src: 'one.jpg', alt: 'Spatial one' },
      { src: 'two.jpg', alt: 'Spatial two' },
      { src: 'three.jpg', alt: 'Spatial three' }
    ]
    render(<Gallery images={threeImages} layout='justified' onImageClick={vi.fn()} />)

    const first = screen.getByRole('button', { name: 'Open Spatial one' })
    const second = screen.getByRole('button', { name: 'Open Spatial two' })
    const third = screen.getByRole('button', { name: 'Open Spatial three' })
    first.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 100, bottom: 80, width: 100, height: 80,
      x: 0, y: 0, toJSON: () => ({})
    }) as DOMRect
    second.getBoundingClientRect = () => ({
      left: 110, top: 0, right: 210, bottom: 80, width: 100, height: 80,
      x: 110, y: 0, toJSON: () => ({})
    }) as DOMRect
    third.getBoundingClientRect = () => ({
      left: 0, top: 90, right: 100, bottom: 170, width: 100, height: 80,
      x: 0, y: 90, toJSON: () => ({})
    }) as DOMRect

    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(third).toHaveFocus()
  })

  it('moves down within a mosaic column instead of to an overlapping featured tile', () => {
    const threeImages: GalleryImage[] = [
      { src: 'feature.jpg', alt: 'Featured tile' },
      { src: 'upper.jpg', alt: 'Upper side tile' },
      { src: 'lower.jpg', alt: 'Lower side tile' }
    ]
    render(<Gallery images={threeImages} layout='mosaic' onImageClick={vi.fn()} />)

    const feature = screen.getByRole('button', { name: 'Open Featured tile' })
    const upper = screen.getByRole('button', { name: 'Open Upper side tile' })
    const lower = screen.getByRole('button', { name: 'Open Lower side tile' })
    feature.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 250, bottom: 396, width: 250, height: 396,
      x: 0, y: 0, toJSON: () => ({})
    }) as DOMRect
    upper.getBoundingClientRect = () => ({
      left: 262, top: 0, right: 450, bottom: 192, width: 188, height: 192,
      x: 262, y: 0, toJSON: () => ({})
    }) as DOMRect
    lower.getBoundingClientRect = () => ({
      left: 262, top: 204, right: 450, bottom: 396, width: 188, height: 192,
      x: 262, y: 204, toJSON: () => ({})
    }) as DOMRect

    upper.focus()
    fireEvent.keyDown(upper, { key: 'ArrowDown' })
    expect(lower).toHaveFocus()

    feature.focus()
    fireEvent.keyDown(feature, { key: 'ArrowDown' })
    expect(lower).toHaveFocus()

    feature.focus()
    fireEvent.keyDown(feature, { key: 'ArrowUp' })
    expect(upper).toHaveFocus()
  })
})

describe('PicGallery', () => {
  it('passes the selected mosaic layout through to the thumbnail gallery', () => {
    render(<PicGallery images={images} layout='mosaic' />)

    expect(document.querySelector('[data-layout="mosaic"]')).toBeInTheDocument()
  })

  it('opens, navigates, and closes the lightbox', async () => {
    render(<PicGallery images={images} />)

    const trigger = screen.getByRole('button', { name: 'Open First image' })
    trigger.focus()
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeVisible()
    expect(dialog.tagName).toBe('DIALOG')
    expect(within(dialog).getByRole('img', { name: 'First image' })).toHaveAttribute(
      'src',
      'one-large.jpg'
    )

    const closeButton = within(dialog).getByRole('button', {
      name: 'Close image viewer'
    })
    closeButton.focus()
    fireEvent.keyDown(closeButton, { key: 'ArrowRight' })
    expect(within(dialog).getByRole('img', { name: 'Second image' })).toBeVisible()

    fireEvent.keyDown(closeButton, { key: 'ArrowLeft' })
    expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()

    const cancelEvent = dispatchDialogCancel(dialog)
    expect(cancelEvent.defaultPrevented).toBe(true)
    expect(dialog).toHaveClass('react-pic-gallery__lightbox--closing')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(document.body.style.overflow).toBe('')
    })
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps the page width stable while body scrolling is locked', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1180)
    document.body.style.paddingRight = '4px'

    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('24px')

    dispatchDialogCancel(screen.getByRole('dialog'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.paddingRight).toBe('4px')
  })

  it('synchronizes when the native dialog is closed externally', async () => {
    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const dialog = screen.getByRole('dialog') as HTMLDialogElement
    dialog.close()

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe('')
  })

  it('allows custom controls to opt out of arrow navigation', () => {
    render(
      <PicGallery
        images={images}
        renderControls={() => (
          <button
            type='button'
            onKeyDown={(event) => event.preventDefault()}
          >
            Custom control
          </button>
        )}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))
    const dialog = screen.getByRole('dialog')
    const control = screen.getByRole('button', { name: 'Custom control' })
    control.focus()
    fireEvent.keyDown(control, { key: 'ArrowRight' })

    expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()
  })

  it('navigates with edge taps when tap zones are active', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn(() => ({ matches: true })) as unknown as typeof window.matchMedia

    try {
      render(<PicGallery images={images} />)
      fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

      const dialog = screen.getByRole('dialog')
      const viewport = dialog.querySelector<HTMLElement>('.react-pic-gallery__viewport')!
      const image = within(dialog).getByRole('img', { name: 'First image' })
      viewport.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }) as DOMRect

      // tap center: no navigation
      fireEvent.click(image, { clientX: 50, clientY: 50 })
      expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()

      // tap right edge: next image
      fireEvent.click(image, { clientX: 90, clientY: 50 })
      expect(within(dialog).getByRole('img', { name: 'Second image' })).toBeVisible()

      // tap left edge: back to previous
      fireEvent.click(within(dialog).getByRole('img', { name: 'Second image' }), {
        clientX: 10,
        clientY: 50
      })
      expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()

      // tap right edge on the last image: stays (no next)
      fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))
      fireEvent.click(within(dialog).getByRole('img', { name: 'First image' }), {
        clientX: 90,
        clientY: 50
      })
      expect(within(dialog).getByRole('img', { name: 'Second image' })).toBeVisible()
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('ignores edge taps when tap zones are not active', () => {
    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const dialog = screen.getByRole('dialog')
    const viewport = dialog.querySelector<HTMLElement>('.react-pic-gallery__viewport')!
    const image = within(dialog).getByRole('img', { name: 'First image' })
    viewport.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }) as DOMRect

    fireEvent.click(image, { clientX: 90, clientY: 50 })
    expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()
  })

  it('keeps both navigation gutters and supports horizontal swipes', () => {    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const dialog = screen.getByRole('dialog')
    const viewport = dialog.querySelector<HTMLElement>('.react-pic-gallery__viewport')!
    expect(viewport).toHaveClass('react-pic-gallery__viewport--has-navigation')
    expect(within(dialog).queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument()

    fireEvent.touchStart(viewport, {
      touches: [{ clientX: 240, clientY: 120 }]
    })
    fireEvent.touchEnd(viewport, {
      changedTouches: [{ clientX: 120, clientY: 124 }]
    })
    expect(within(dialog).getByRole('img', { name: 'Second image' })).toBeVisible()
    expect(
      within(dialog).getByRole('img', { name: 'Second image' }).parentElement
    ).toHaveClass('react-pic-gallery__lightbox-image--swipe-next')
    expect(within(dialog).queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument()

    fireEvent.touchStart(viewport, {
      touches: [{ clientX: 120, clientY: 120 }]
    })
    fireEvent.touchEnd(viewport, {
      changedTouches: [{ clientX: 240, clientY: 124 }]
    })
    expect(within(dialog).getByRole('img', { name: 'First image' })).toBeVisible()
  })

  it('closes when the lightbox viewport backdrop is clicked', async () => {
    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const dialog = screen.getByRole('dialog')
    const viewport = dialog.querySelector<HTMLElement>('.react-pic-gallery__viewport')!
    fireEvent.mouseDown(viewport)

    expect(dialog).toHaveClass('react-pic-gallery__lightbox--closing')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('keeps the lightbox image contained without a JavaScript transform', () => {
    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const image = within(screen.getByRole('dialog')).getByRole('img', {
      name: 'First image'
    })

    expect(image).toHaveStyle({ objectFit: 'contain' })
    expect(image.style.transform).toBe('')
  })

  it('passes the current image and actions to custom UI', () => {
    const action = vi.fn()

    render(
      <PicGallery
        images={images}
        renderActions={({ image, next }) => (
          <button
            type='button'
            onClick={() => {
              action(image.id)
              next()
            }}
          >
            Save current
          </button>
        )}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save current' }))

    expect(action).toHaveBeenCalledWith('one')
    expect(
      within(screen.getByRole('dialog')).getByRole('img', { name: 'Second image' })
    ).toBeVisible()
  })
})

describe('Lightbox', () => {
  it('supports controlled rendering and custom controls', async () => {
    function ControlledLightbox() {
      const [index, setIndex] = useState<number | null>(0)

      return (
        <Lightbox
          images={images}
          index={index}
          onIndexChange={setIndex}
          renderControls={({ close, next }) => (
            <>
              <button type='button' onClick={next}>
                Forward
              </button>
              <button type='button' onClick={close}>
                Done
              </button>
            </>
          )}
        />
      )
    }

    render(<ControlledLightbox />)
    expect(screen.getByRole('button', { name: 'Forward' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Close image viewer' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Forward' }))
    expect(
      within(screen.getByRole('dialog')).getByRole('img', { name: 'Second image' })
    ).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
