import type { ReactNode } from 'react'
import { Image } from './Image'
import type { GalleryImage, LightboxContext, LightboxRenderer } from './types'
import type { UseCarouselNavigationResult } from './useCarouselNavigation'
import { ChevronIcon, CloseIcon, getEdgeTapZone, joinClassNames } from './utils'

export type CarouselProps<T extends GalleryImage = GalleryImage> = {
  images: readonly T[]
  index: number
  navigation: UseCarouselNavigationResult
  renderActions?: LightboxRenderer<T>
  renderCaption?: LightboxRenderer<T>
  renderControls?: LightboxRenderer<T>
  showCounter?: boolean
  showNavigation?: boolean
  close?: () => void
  onEmptyAreaClick?: () => void
  onImageClick?: () => void
  className?: string
}

export function Carousel<T extends GalleryImage>(props: CarouselProps<T>): ReactNode {
  const {
    images, index, navigation, renderActions, renderCaption, renderControls,
    showCounter = true, showNavigation = true, close, onEmptyAreaClick,
    onImageClick, className
  } = props
  const image = images[index]
  const context: LightboxContext<T> = {
    image,
    index,
    count: images.length,
    close: close ?? (() => {}),
    next: navigation.next,
    previous: navigation.previous,
    canGoNext: index < images.length - 1,
    canGoPrevious: index > 0
  }
  const hasNavigation = showNavigation && images.length > 1
  const showPrevious = showNavigation && context.canGoPrevious
  const showNext = showNavigation && context.canGoNext

  return (
    <>
      <p className='react-pic-gallery__sr-only' aria-live='polite'>
        {image.alt}, image {index + 1} of {images.length}
      </p>
      <div className={joinClassNames('react-pic-gallery__lightbox-content', className)}>
        {renderControls ? (
          <div className='react-pic-gallery__custom-controls'>
            {renderControls(context)}
          </div>
        ) : (
          <div className='react-pic-gallery__toolbar'>
            <div className='react-pic-gallery__toolbar-actions'>
              {showCounter && (
                <span aria-live='polite'>
                  {index + 1} / {images.length}
                </span>
              )}
              {renderActions?.(context)}
            </div>
            {close && (
              <button
                className='react-pic-gallery__control'
                type='button'
                onClick={close}
                aria-label='Close image viewer'
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        <div
          className={joinClassNames(
            'react-pic-gallery__viewport',
            hasNavigation ? 'react-pic-gallery__viewport--has-navigation' : undefined
          )}
          onMouseDown={event => {
            if (event.target === event.currentTarget) onEmptyAreaClick?.()
          }}
          onClick={navigation.handleViewportClick}
          onTouchCancel={navigation.handleTouchCancel}
          onTouchEnd={navigation.handleTouchEnd}
          onTouchStart={navigation.handleTouchStart}
        >
          {showPrevious && (
            <button
              className='react-pic-gallery__control react-pic-gallery__control--previous'
              type='button'
              onClick={navigation.previous}
              aria-label='Previous image'
            >
              <ChevronIcon direction='left' />
            </button>
          )}
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            eager
            objectFit='contain'
            className={joinClassNames(
              'react-pic-gallery__lightbox-image',
              navigation.swipeDirection
                ? `react-pic-gallery__lightbox-image--swipe-${navigation.swipeDirection}`
                : undefined
            )}
            onAnimationEnd={navigation.handleImageAnimationEnd}
            onClick={
              onImageClick
                ? event => {
                    const wouldEdgeNavigate =
                      showNavigation &&
                      images.length > 1 &&
                      getEdgeTapZone(event.clientX, event.currentTarget.parentElement) !== null
                    if (!wouldEdgeNavigate) onImageClick()
                  }
                : undefined
            }
          />
          {showNext && (
            <button
              className='react-pic-gallery__control react-pic-gallery__control--next'
              type='button'
              onClick={navigation.next}
              aria-label='Next image'
            >
              <ChevronIcon direction='right' />
            </button>
          )}
        </div>

        {(renderCaption || image.caption) && (
          <div className='react-pic-gallery__caption'>
            {renderCaption ? renderCaption(context) : image.caption}
          </div>
        )}
      </div>
    </>
  )
}
