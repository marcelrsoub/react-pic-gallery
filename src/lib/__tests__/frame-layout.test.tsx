/// <reference types="@testing-library/jest-dom" />

import { act, cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Gallery } from '../Gallery'
import { PicGallery } from '../PicGallery'
import { buildJustifiedRows } from '../layout'
import type { GalleryImage } from '../types'

const images: GalleryImage[] = Array.from({ length: 6 }, (_, index) => ({
  src: `frame-${index}.jpg`,
  alt: `Frame image ${index + 1}`,
  width: 1500,
  height: 1000
}))

function makeRect(width: number, height: number): DOMRect {
  return {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({})
  } as DOMRect
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('gallery frame appearance', () => {
  it('defaults standalone Gallery to a single framed container', () => {
    const { container } = render(<Gallery images={images} />)

    expect(container.querySelectorAll('.react-pic-gallery__gallery--framed')).toHaveLength(1)
    expect(container.querySelector('.react-pic-gallery__gallery--bare')).not.toBeInTheDocument()
  })

  it('keeps exactly one frame on composed PicGallery and forwards bare appearance', () => {
    const { container, rerender } = render(<PicGallery images={images} />)
    const wrapper = container.querySelector('.react-pic-gallery')!

    expect(wrapper.querySelectorAll('.react-pic-gallery__gallery--framed')).toHaveLength(1)
    expect(wrapper).not.toHaveClass('react-pic-gallery__gallery--framed')

    rerender(<PicGallery images={images} appearance='bare' />)

    expect(wrapper.querySelectorAll('.react-pic-gallery__gallery--framed')).toHaveLength(0)
    expect(wrapper.querySelectorAll('.react-pic-gallery__gallery--bare')).toHaveLength(1)
  })
})

describe('justified content-box measurement', () => {
  it('subtracts frame padding and borders, then remeasures on resize and appearance changes without replacing focused tiles', () => {
    const box = { width: 1000 }
    const originalGetComputedStyle = window.getComputedStyle.bind(window)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      if (this.classList.contains('react-pic-gallery__gallery')) {
        return makeRect(box.width, 500)
      }
      if (this.classList.contains('react-pic-gallery__row-height-probe')) {
        return makeRect(12, 180)
      }
      return makeRect(0, 0)
    })
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const target = element as HTMLElement
      if (target.classList.contains('react-pic-gallery__row-height-probe')) {
        return { width: '12px' } as CSSStyleDeclaration
      }
      if (target.classList.contains('react-pic-gallery__gallery')) {
        const isFramed = target.classList.contains('react-pic-gallery__gallery--framed')
        return {
          paddingLeft: isFramed ? '20px' : '0px',
          paddingRight: isFramed ? '20px' : '0px',
          borderLeftWidth: isFramed ? '5px' : '0px',
          borderRightWidth: isFramed ? '5px' : '0px'
        } as CSSStyleDeclaration
      }
      return originalGetComputedStyle(element)
    })

    const onImageClick = vi.fn()
    const renderGallery = (appearance: 'framed' | 'bare') => (
      <Gallery
        images={images}
        layout='justified'
        rowHeight={180}
        appearance={appearance}
        onImageClick={onImageClick}
      />
    )
    const { container, rerender } = render(renderGallery('framed'))
    const firstTile = container.querySelector<HTMLButtonElement>(
      '.react-pic-gallery__tile--justified'
    )!
    firstTile.focus()

    const framedContentWidth = 1000 - 40 - 10
    const framedWidth = Number.parseFloat(firstTile.style.width)
    expect(framedWidth).toBeCloseTo(
      buildJustifiedRows(images, framedContentWidth, 180, 12)[0].widths[0]
    )

    rerender(renderGallery('bare'))
    const bareWidth = Number.parseFloat(firstTile.style.width)
    expect(bareWidth).toBeCloseTo(buildJustifiedRows(images, 1000, 180, 12)[0].widths[0])
    expect(bareWidth).not.toBeCloseTo(framedWidth)
    expect(container.querySelector('.react-pic-gallery__tile--justified')).toBe(firstTile)
    expect(firstTile).toHaveFocus()

    box.width = 900
    act(() => window.dispatchEvent(new Event('resize')))

    expect(Number.parseFloat(firstTile.style.width)).toBeCloseTo(
      buildJustifiedRows(images, 900, 180, 12)[0].widths[0]
    )
    expect(container.querySelector('.react-pic-gallery__tile--justified')).toBe(firstTile)
    expect(firstTile).toHaveFocus()
  })

  it('falls back safely when box and probe measurements are zero or non-finite', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      if (this.classList.contains('react-pic-gallery__row-height-probe')) {
        return makeRect(Number.NaN, Number.NaN)
      }
      return makeRect(0, 0)
    })
    const originalGetComputedStyle = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const target = element as HTMLElement
      if (target.classList.contains('react-pic-gallery__row-height-probe')) {
        return { width: 'not-a-length' } as CSSStyleDeclaration
      }
      if (target.classList.contains('react-pic-gallery__gallery')) {
        return {
          paddingLeft: 'invalid',
          paddingRight: 'invalid',
          borderLeftWidth: 'invalid',
          borderRightWidth: 'invalid'
        } as CSSStyleDeclaration
      }
      return originalGetComputedStyle(element)
    })

    const { container } = render(
      <Gallery images={images} layout='justified' rowHeight={Number.NaN} />
    )
    const firstTile = container.querySelector<HTMLButtonElement>(
      '.react-pic-gallery__tile--justified'
    )!
    const width = Number.parseFloat(firstTile.style.width)

    expect(Number.isFinite(width)).toBe(true)
    expect(width).toBeCloseTo(
      buildJustifiedRows(images, 1024, 192, 12)[0].widths[0]
    )
  })
})
