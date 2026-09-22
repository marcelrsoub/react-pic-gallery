import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
  type TouchEvent as ReactTouchEvent
} from 'react'
import { createPortal } from 'react-dom'
import { Image } from './Image'
import type { GalleryImage, LightboxContext, LightboxProps } from './types'

type BodyLockToken = object

type BodyLockSnapshot = {
  overflow: string
  paddingRight: string
}

const bodyLocks = new Set<BodyLockToken>()
let bodyLockSnapshot: BodyLockSnapshot | null = null
const interactiveControlSelector =
  'a[href], button, input, select, textarea, [role="combobox"], [role="menu"], [role="slider"], [role="spinbutton"], [role="tab"]'
const lightboxImageSelector = '.react-pic-gallery__image-element'
const maxZoomScale = 3

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest(interactiveControlSelector) !== null
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function lockBodyScroll(token: BodyLockToken) {
  if (bodyLocks.has(token)) return

  if (bodyLocks.size === 0) {
    const body = document.body
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const bodyPaddingRight = Number.parseFloat(
      window.getComputedStyle(body).paddingRight
    ) || 0

    bodyLockSnapshot = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight
    }
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`
    }
  }

  bodyLocks.add(token)
}

function unlockBodyScroll(token: BodyLockToken) {
  bodyLocks.delete(token)
  if (bodyLocks.size > 0 || !bodyLockSnapshot) return false

  document.body.style.overflow = bodyLockSnapshot.overflow
  document.body.style.paddingRight = bodyLockSnapshot.paddingRight
  bodyLockSnapshot = null
  return true
}

function parseTime(value: string) {
  const trimmed = value.trim()
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed)
  if (trimmed.endsWith('s')) return Number.parseFloat(trimmed) * 1000
  return 0
}

function getAnimationDuration(element: HTMLElement) {
  const computedStyle = window.getComputedStyle(element)
  const durations = computedStyle.animationDuration.split(',')
  const delays = computedStyle.animationDelay.split(',')

  return Math.max(
    ...durations.map(
      (duration, index) =>
        parseTime(duration) + parseTime(delays[index % delays.length] ?? '0s')
    ),
    0
  )
}

function CloseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path d={direction === 'left' ? 'M14.5 5l-7 7 7 7' : 'M9.5 5l7 7-7 7'} />
    </svg>
  )
}

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(' ')
}

export function Lightbox<T extends GalleryImage>({
  images,
  index,
  onIndexChange,
  renderActions,
  renderCaption,
  renderControls,
  showCounter = true,
  showNavigation = true,
  className
}: LightboxProps<T>) {
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const changeIndexRef = useRef(onIndexChange)
  const closeTimerRef = useRef<number | null>(null)
  const closeRequestRef = useRef<{ index: number } | null>(null)
  const activeIndexRef = useRef<number | null>(null)
  const isClosingRef = useRef(false)
  const suppressNativeCloseRef = useRef(false)
  const bodyLockTokenRef = useRef<BodyLockToken>({})
  const imagesRef = useRef(images)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pointerPositionsRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchStartRef = useRef<{
    distance: number
    scale: number
    offset: { x: number; y: number }
  } | null>(null)
  const panStartRef = useRef<{
    x: number
    y: number
    offset: { x: number; y: number }
  } | null>(null)
  const titleId = useId()
  const [isClosing, setIsClosing] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'next' | 'previous' | null>(null)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 })
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const activeIndex =
    index !== null && index >= 0 && index < images.length ? index : null
  const image = activeIndex === null ? undefined : images[activeIndex]

  changeIndexRef.current = onIndexChange
  activeIndexRef.current = activeIndex
  isClosingRef.current = isClosing
  imagesRef.current = images

  const cancelPendingClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    closeRequestRef.current = null
  }, [])

  const close = useCallback(() => {
    const currentIndex = activeIndexRef.current
    if (currentIndex === null || closeRequestRef.current !== null) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      changeIndexRef.current(null)
      return
    }

    closeRequestRef.current = { index: currentIndex }
    isClosingRef.current = true
    setIsClosing(true)
  }, [])

  const previous = useCallback(() => {
    const currentIndex = activeIndexRef.current
    if (!isClosingRef.current && currentIndex !== null && currentIndex > 0) {
      changeIndexRef.current(currentIndex - 1)
    }
  }, [])

  const next = useCallback(() => {
    const currentIndex = activeIndexRef.current
    if (
      !isClosingRef.current &&
      currentIndex !== null &&
      currentIndex < imagesRef.current.length - 1
    ) {
      changeIndexRef.current(currentIndex + 1)
    }
  }, [])

  const swipePrevious = useCallback(() => {
    const currentIndex = activeIndexRef.current
    if (isClosingRef.current || currentIndex === null || currentIndex === 0) return

    setSwipeDirection('previous')
    changeIndexRef.current(currentIndex - 1)
  }, [])

  const swipeNext = useCallback(() => {
    const currentIndex = activeIndexRef.current
    if (
      isClosingRef.current ||
      currentIndex === null ||
      currentIndex >= imagesRef.current.length - 1
    ) {
      return
    }

    setSwipeDirection('next')
    changeIndexRef.current(currentIndex + 1)
  }, [])

  const handleCancel = useCallback(
    (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault()
      close()
    },
    [close]
  )

  const finishClose = useCallback(() => {
    const request = closeRequestRef.current
    if (!request) return

    if (activeIndexRef.current !== request.index) {
      cancelPendingClose()
      isClosingRef.current = false
      setIsClosing(false)
      return
    }

    cancelPendingClose()
    isClosingRef.current = false
    setIsClosing(false)
    changeIndexRef.current(null)
  }, [cancelPendingClose])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDialogElement>) => {
      if (event.defaultPrevented) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest(interactiveControlSelector))
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previous()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      }
    },
    [next, previous]
  )

  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    if (
      zoomScale > 1 ||
      event.touches.length !== 1 ||
      isInteractiveTarget(event.target)
    ) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [zoomScale])

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current
      touchStartRef.current = null
      if (!start || event.changedTouches.length === 0) return

      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - start.x
      const deltaY = touch.clientY - start.y
      const horizontalDistance = Math.abs(deltaX)

      if (horizontalDistance < 48 || horizontalDistance <= Math.abs(deltaY)) return

      if (deltaX < 0) {
        swipeNext()
      } else {
        swipePrevious()
      }
    },
    [swipeNext, swipePrevious, zoomScale]
  )

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null
  }, [])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        !(event.target instanceof Element) ||
        event.target.closest(lightboxImageSelector) === null ||
        (event.pointerType === 'mouse' && event.button !== 0)
      ) {
        return
      }

      const pointers = pointerPositionsRef.current
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      event.currentTarget.setPointerCapture?.(event.pointerId)

      if (pointers.size === 2) {
        const [first, second] = [...pointers.values()]
        const distance = Math.hypot(second.x - first.x, second.y - first.y)
        const imageElement = event.currentTarget.querySelector<HTMLImageElement>(
          lightboxImageSelector
        )
        const rect = imageElement?.getBoundingClientRect()
        const centerX = (first.x + second.x) / 2
        const centerY = (first.y + second.y) / 2

        if (rect && rect.width > 0 && rect.height > 0) {
          setZoomOrigin(
            `${clamp(((centerX - rect.left) / rect.width) * 100, 0, 100)}% ${clamp(
              ((centerY - rect.top) / rect.height) * 100,
              0,
              100
            )}%`
          )
        }

        pinchStartRef.current = {
          distance: Math.max(distance, 1),
          scale: zoomScale,
          offset: zoomOffset
        }
        panStartRef.current = null
      } else if (zoomScale > 1) {
        panStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          offset: zoomOffset
        }
      }
    },
    [zoomOffset, zoomScale]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pointers = pointerPositionsRef.current
      if (!pointers.has(event.pointerId)) return

      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointers.size >= 2 && pinchStartRef.current) {
        const [first, second] = [...pointers.values()]
        const distance = Math.max(
          Math.hypot(second.x - first.x, second.y - first.y),
          1
        )
        const nextScale = clamp(
          pinchStartRef.current.scale * (distance / pinchStartRef.current.distance),
          1,
          maxZoomScale
        )
        setZoomScale(nextScale)
        setZoomOffset(pinchStartRef.current.offset)
        event.preventDefault()
        return
      }

      if (pointers.size === 1 && panStartRef.current && zoomScale > 1) {
        const imageElement = event.currentTarget.querySelector<HTMLImageElement>(
          lightboxImageSelector
        )
        const width = imageElement?.clientWidth ?? 0
        const height = imageElement?.clientHeight ?? 0
        const maxOffsetX = Math.max(0, (width * (zoomScale - 1)) / 2)
        const maxOffsetY = Math.max(0, (height * (zoomScale - 1)) / 2)
        const offsetX = panStartRef.current.offset.x + event.clientX - panStartRef.current.x
        const offsetY = panStartRef.current.offset.y + event.clientY - panStartRef.current.y

        setZoomOffset({
          x: clamp(offsetX, -maxOffsetX, maxOffsetX),
          y: clamp(offsetY, -maxOffsetY, maxOffsetY)
        })
        event.preventDefault()
      }
    },
    [zoomScale]
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerPositionsRef.current.delete(event.pointerId)
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null
      if (pointerPositionsRef.current.size === 1 && zoomScale > 1) {
        const [pointer] = [...pointerPositionsRef.current.values()]
        panStartRef.current = {
          x: pointer.x,
          y: pointer.y,
          offset: zoomOffset
        }
      } else {
        panStartRef.current = null
      }
    },
    [zoomOffset, zoomScale]
  )

  const handleImageAnimationEnd = useCallback(
    (event: ReactAnimationEvent<HTMLSpanElement>) => {
      if (event.target === event.currentTarget) setSwipeDirection(null)
    },
    []
  )

  const handleAnimationEnd = useCallback(
    (event: ReactAnimationEvent<HTMLDialogElement>) => {
      if (
        event.target === event.currentTarget &&
        event.animationName === 'react-pic-gallery-fade-out'
      ) {
        finishClose()
      }
    },
    [finishClose]
  )

  const handleNativeClose = useCallback(() => {
    if (suppressNativeCloseRef.current) return

    cancelPendingClose()
    isClosingRef.current = false
    setIsClosing(false)
    if (activeIndexRef.current !== null) {
      changeIndexRef.current(null)
    }
  }, [cancelPendingClose])

  useEffect(() => {
    setZoomScale(1)
    setZoomOffset({ x: 0, y: 0 })
    setZoomOrigin('50% 50%')
    pointerPositionsRef.current.clear()
    pinchStartRef.current = null
    panStartRef.current = null
  }, [activeIndex])

  useEffect(() => {
    const request = closeRequestRef.current
    if (!request || activeIndex === request.index) return

    cancelPendingClose()
    isClosingRef.current = false
    setIsClosing(false)
  }, [activeIndex, cancelPendingClose])

  useEffect(() => {
    if (!isClosing || !closeRequestRef.current || !lightboxRef.current) return

    const duration = getAnimationDuration(lightboxRef.current)
    closeTimerRef.current = window.setTimeout(finishClose, duration)

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [finishClose, isClosing])

  useEffect(() => {
    if (activeIndex === null) return

    const dialog = lightboxRef.current
    if (!dialog) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    lockBodyScroll(bodyLockTokenRef.current)

    if (!dialog.open) {
      dialog.showModal()
    }

    return () => {
      cancelPendingClose()
      suppressNativeCloseRef.current = true
      if (dialog.open) dialog.close()
      suppressNativeCloseRef.current = false

      const isLastBodyLock = unlockBodyScroll(bodyLockTokenRef.current)
      if (isLastBodyLock && previousActiveElement?.isConnected) {
        previousActiveElement.focus()
      }
    }
  }, [activeIndex !== null, cancelPendingClose])

  if (activeIndex === null || !image || typeof document === 'undefined') {
    return null
  }

  const context: LightboxContext<T> = {
    image,
    index: activeIndex,
    count: images.length,
    close,
    next,
    previous,
    canGoNext: activeIndex < images.length - 1,
    canGoPrevious: activeIndex > 0
  }
  const showPrevious = showNavigation && !renderControls && context.canGoPrevious
  const showNext = showNavigation && !renderControls && context.canGoNext
  const hasNavigation = showNavigation && !renderControls && images.length > 1

  const handleBackdropClick = (event: ReactMouseEvent) => {
    if (event.target === event.currentTarget) close()
  }

  return createPortal(
    <dialog
      ref={lightboxRef}
      className={joinClassNames(
        'react-pic-gallery__lightbox',
        isClosing ? 'react-pic-gallery__lightbox--closing' : undefined,
        className
      )}
      aria-labelledby={titleId}
      onAnimationEnd={handleAnimationEnd}
      onClose={handleNativeClose}
      onMouseDown={handleBackdropClick}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <h2 className='react-pic-gallery__sr-only' id={titleId}>
        Image viewer
      </h2>
      <p className='react-pic-gallery__sr-only' aria-live='polite'>
        {image.alt}, image {activeIndex + 1} of {images.length}
      </p>
      <div className='react-pic-gallery__lightbox-content'>
        {renderControls ? (
          <div className='react-pic-gallery__custom-controls'>
            {renderControls(context)}
          </div>
        ) : (
          <div className='react-pic-gallery__toolbar'>
            <div className='react-pic-gallery__toolbar-actions'>
              {showCounter && (
                <span aria-live='polite'>
                  {activeIndex + 1} / {images.length}
                </span>
              )}
              {renderActions?.(context)}
            </div>
            <button
              className='react-pic-gallery__control'
              type='button'
              onClick={close}
              aria-label='Close image viewer'
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div
          className={joinClassNames(
            'react-pic-gallery__viewport',
            hasNavigation ? 'react-pic-gallery__viewport--has-navigation' : undefined
          )}
          onMouseDown={handleBackdropClick}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onTouchCancel={handleTouchCancel}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          {showPrevious && (
            <button
              className='react-pic-gallery__control react-pic-gallery__control--previous'
              type='button'
              onClick={previous}
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
            width={image.width}
            height={image.height}
            className={joinClassNames(
              'react-pic-gallery__lightbox-image',
              swipeDirection
                ? `react-pic-gallery__lightbox-image--swipe-${swipeDirection}`
                : undefined
            )}
            imageStyle={{
              transform: `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0) scale(${zoomScale})`,
              transformOrigin: zoomOrigin,
              transition: pointerPositionsRef.current.size > 0 ? 'none' : undefined
            }}
            onAnimationEnd={handleImageAnimationEnd}
          />
          {showNext && (
            <button
              className='react-pic-gallery__control react-pic-gallery__control--next'
              type='button'
              onClick={next}
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
    </dialog>,
    document.body
  )
}
