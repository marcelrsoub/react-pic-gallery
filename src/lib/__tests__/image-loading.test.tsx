/// <reference types="@testing-library/jest-dom" />

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Gallery } from '../Gallery'
import { Image } from '../Image'
import { Lightbox } from '../Lightbox'
import type { GalleryImage } from '../types'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('responsive image loading', () => {
  it('uses a dedicated responsive thumbnail family without the full srcSet', () => {
    const image: GalleryImage = {
      src: 'full.jpg',
      srcSet: 'full-640.jpg 640w, full-1280.jpg 1280w',
      sizes: '100vw',
      thumbnailSrcSet: 'thumb-320.jpg 320w, thumb-640.jpg 640w',
      thumbnailSizes: '(max-width: 600px) 100vw, 320px',
      alt: 'Responsive image'
    }

    render(<Gallery images={[image]} />)

    const thumbnail = screen.getByRole('img', { name: image.alt })
    expect(thumbnail).toHaveAttribute('src', 'full.jpg')
    expect(thumbnail).toHaveAttribute('srcset', image.thumbnailSrcSet)
    expect(thumbnail).toHaveAttribute('sizes', image.thumbnailSizes)
    expect(thumbnail).not.toHaveAttribute('srcset', image.srcSet)
  })

  it('prefers thumbnailSrc when both dedicated thumbnail properties exist', () => {
    const image: GalleryImage = {
      src: 'full.jpg',
      srcSet: 'full-2x.jpg 2x',
      thumbnailSrc: 'thumb.jpg',
      thumbnailSrcSet: 'thumb-2x.jpg 2x',
      alt: 'Thumbnail source'
    }

    render(<Gallery images={[image]} />)

    const thumbnail = screen.getByRole('img', { name: image.alt })
    expect(thumbnail).toHaveAttribute('src', 'thumb.jpg')
    expect(thumbnail).toHaveAttribute('srcset', 'thumb-2x.jpg 2x')
    expect(thumbnail).not.toHaveAttribute('sizes')
  })

  it('uses the full responsive family for thumbnails without dedicated sources and for viewers', () => {
    const image: GalleryImage = {
      src: 'full.jpg',
      srcSet: 'full-640.jpg 640w, full-1280.jpg 1280w',
      sizes: '90vw',
      alt: 'Full responsive image'
    }
    const { rerender } = render(<Gallery images={[image]} />)

    const thumbnail = screen.getByRole('img', { name: image.alt })
    expect(thumbnail).toHaveAttribute('srcset', image.srcSet)
    expect(thumbnail).toHaveAttribute('sizes', image.sizes)

    rerender(
      <Lightbox
        images={[image]}
        index={0}
        onIndexChange={vi.fn()}
      />
    )

    const viewerImage = screen.getByRole('img', { name: image.alt })
    expect(viewerImage).toHaveAttribute('src', image.src)
    expect(viewerImage).toHaveAttribute('srcset', image.srcSet)
    expect(viewerImage).toHaveAttribute('sizes', image.sizes)
    expect(viewerImage).toHaveAttribute('loading', 'eager')
  })

  it('resets loading state when only responsive source attributes change and reports errors', () => {
    const { rerender } = render(
      <Image
        src='fallback.jpg'
        srcSet='first.jpg 1x'
        sizes='50vw'
        alt='Changing source'
      />
    )
    const image = screen.getByRole('img', { name: 'Changing source' })

    fireEvent.load(image)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    rerender(
      <Image
        src='fallback.jpg'
        srcSet='second.jpg 1x'
        sizes='50vw'
        alt='Changing source'
      />
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    fireEvent.error(image)
    expect(screen.getByRole('status')).toHaveTextContent('Unable to load image')

    rerender(
      <Image
        src='fallback.jpg'
        srcSet='third.jpg 1x'
        sizes='50vw'
        alt='Changing source'
      />
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('detects cached responsive images and preserves async decoding', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(640)

    render(
      <Image
        src='cached.jpg'
        srcSet='cached-large.jpg 2x'
        sizes='100vw'
        alt='Cached responsive image'
      />
    )

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Cached responsive image' })).toHaveAttribute(
      'decoding',
      'async'
    )
  })
})
