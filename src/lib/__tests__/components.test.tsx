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
})

describe('PicGallery', () => {
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

    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(within(dialog).getByRole('img', { name: 'Second image' })).toBeVisible()

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

  it('keeps both navigation gutters and supports horizontal swipes', () => {
    render(<PicGallery images={images} />)
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

  it('supports bounded pinch zooming in the lightbox', () => {
    render(<PicGallery images={images} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open First image' }))

    const image = within(screen.getByRole('dialog')).getByRole('img', {
      name: 'First image'
    })
    fireEvent.pointerDown(image, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 100,
      clientY: 100
    })
    fireEvent.pointerDown(image, {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 200,
      clientY: 100
    })
    fireEvent.pointerMove(image, {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 300,
      clientY: 100
    })

    expect(image.getAttribute('style')).toContain('scale(2)')
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
