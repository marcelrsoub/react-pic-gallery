/// <reference types="@testing-library/jest-dom" />

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Gallery } from '../Gallery'
import { Lightbox } from '../Lightbox'
import { PicGallery } from '../PicGallery'
import { resetAdjacentImagePreloadCache } from '../useAdjacentImagePreload'
import type { GalleryImage } from '../types'

class MockPreloadImage extends EventTarget {
  static instances: MockPreloadImage[] = []

  readonly assignments: Array<[string, string]> = []
  fetchPriority = ''
  private assignedSizes = ''
  private assignedSrcSet = ''
  private assignedSrc = ''

  constructor() {
    super()
    MockPreloadImage.instances.push(this)
  }

  get sizes() {
    return this.assignedSizes
  }

  set sizes(value: string) {
    this.assignedSizes = value
    this.assignments.push(['sizes', value])
  }

  get srcset() {
    return this.assignedSrcSet
  }

  set srcset(value: string) {
    this.assignedSrcSet = value
    this.assignments.push(['srcset', value])
  }

  get src() {
    return this.assignedSrc
  }

  set src(value: string) {
    this.assignedSrc = value
    this.assignments.push(['src', value])
  }

  load() {
    this.dispatchEvent(new Event('load'))
  }

  fail() {
    this.dispatchEvent(new Event('error'))
  }
}

const images: GalleryImage[] = [
  {
    src: 'one-full.jpg',
    srcSet: 'one-640.jpg 640w, one-1280.jpg 1280w',
    sizes: '100vw',
    thumbnailSrc: 'one-thumb.jpg',
    alt: 'First preload image'
  },
  {
    src: 'two-full.jpg',
    srcSet: 'two-640.jpg 640w, two-1280.jpg 1280w',
    sizes: '(max-width: 700px) 100vw, 700px',
    alt: 'Second preload image'
  },
  {
    src: 'three-full.jpg',
    srcSet: 'three-640.jpg 640w, three-1280.jpg 1280w',
    sizes: '90vw',
    alt: 'Third preload image'
  }
]

beforeEach(() => {
  MockPreloadImage.instances = []
  vi.stubGlobal('Image', MockPreloadImage)
})

afterEach(() => {
  cleanup()
  resetAdjacentImagePreloadCache()
  vi.unstubAllGlobals()
})

describe('adjacent image preloading', () => {
  it('preloads only bounded immediate neighbors at low priority in responsive assignment order', () => {
    render(<Gallery images={images} layout='carousel' />)

    expect(MockPreloadImage.instances).toHaveLength(1)
    const firstPreload = MockPreloadImage.instances[0]
    expect(firstPreload.fetchPriority).toBe('low')
    expect(firstPreload.assignments).toEqual([
      ['sizes', images[1].sizes!],
      ['srcset', images[1].srcSet!],
      ['src', images[1].src]
    ])

    firstPreload.load()
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(MockPreloadImage.instances.slice(1).map((image) => image.src)).toEqual([
      images[0].src,
      images[2].src
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('img', { name: images[2].alt })).toBeVisible()
    expect(MockPreloadImage.instances).toHaveLength(3)
  })

  it('does not preload grids, closed lightboxes, empty carousels, or single-image carousels', () => {
    const { rerender } = render(<Gallery images={images} />)
    expect(MockPreloadImage.instances).toHaveLength(0)

    rerender(
      <Lightbox images={images} index={null} onIndexChange={vi.fn()} />
    )
    expect(MockPreloadImage.instances).toHaveLength(0)

    rerender(<Gallery images={[]} layout='carousel' />)
    expect(MockPreloadImage.instances).toHaveLength(0)

    rerender(<Gallery images={[images[0]]} layout='carousel' />)
    expect(MockPreloadImage.instances).toHaveLength(0)
  })

  it('preloads neighbors only while a lightbox is open', () => {
    const onIndexChange = vi.fn()
    const { rerender } = render(
      <Lightbox images={images} index={null} onIndexChange={onIndexChange} />
    )
    expect(MockPreloadImage.instances).toHaveLength(0)

    rerender(<Lightbox images={images} index={1} onIndexChange={onIndexChange} />)
    expect(MockPreloadImage.instances.map((image) => image.src)).toEqual([
      images[0].src,
      images[2].src
    ])

    rerender(<Lightbox images={images} index={null} onIndexChange={onIndexChange} />)
    expect(MockPreloadImage.instances).toHaveLength(2)
  })

  it('deduplicates matching carousel and open-lightbox neighbor requests', () => {
    render(<PicGallery images={images} layout='carousel' />)

    expect(MockPreloadImage.instances).toHaveLength(1)
    expect(MockPreloadImage.instances[0].src).toBe(images[1].src)

    fireEvent.click(screen.getByRole('img', { name: images[0].alt }))

    expect(screen.getByRole('dialog')).toBeVisible()
    expect(MockPreloadImage.instances).toHaveLength(1)
  })

  it('forwards preloadAdjacent opt-out through PicGallery and Lightbox', () => {
    const { unmount } = render(
      <PicGallery images={images} layout='carousel' preloadAdjacent={false} />
    )
    expect(MockPreloadImage.instances).toHaveLength(0)

    fireEvent.click(screen.getByRole('img', { name: images[0].alt }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(MockPreloadImage.instances).toHaveLength(0)

    unmount()
    render(
      <Lightbox
        images={images}
        index={0}
        onIndexChange={vi.fn()}
        preloadAdjacent={false}
      />
    )
    expect(MockPreloadImage.instances).toHaveLength(0)
  })

  it('retries failed preloads and safely follows a changed image array', () => {
    const { rerender } = render(<Gallery images={images} layout='carousel' />)
    const failedPreload = MockPreloadImage.instances[0]
    expect(failedPreload.src).toBe(images[1].src)
    failedPreload.fail()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(MockPreloadImage.instances.at(-1)?.src).toBe(images[1].src)
    expect(MockPreloadImage.instances.filter((image) => image.src === images[1].src)).toHaveLength(2)

    const changedImages = [
      { ...images[0], src: 'changed-one.jpg' },
      { ...images[1], src: 'changed-two.jpg' }
    ]
    rerender(<Gallery images={changedImages} layout='carousel' />)
    expect(screen.getByRole('img', { name: changedImages[0].alt })).toBeVisible()
    expect(MockPreloadImage.instances.at(-1)?.src).toBe(changedImages[1].src)
  })
})
