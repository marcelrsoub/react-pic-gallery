import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent
} from 'react'
import { createPortal } from 'react-dom'
import { Carousel } from './Carousel'
import { useCarouselNavigation } from './useCarouselNavigation'
import { joinClassNames } from './utils'
import type { GalleryImage, LightboxProps } from './types'

type BodyLockToken = object

type BodyLockSnapshot = {
  overflow: string
  paddingRight: string
}

const bodyLocks = new Set<BodyLockToken>()
let bodyLockSnapshot: BodyLockSnapshot | null = null

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
  const suppressNativeCloseRef = useRef(false)
  const bodyLockTokenRef = useRef<BodyLockToken>({})
  const titleId = useId()
  const [isClosing, setIsClosing] = useState(false)
  const activeIndex =
    index !== null && index >= 0 && index < images.length ? index : null
  const image = activeIndex === null ? undefined : images[activeIndex]

  changeIndexRef.current = onIndexChange
  activeIndexRef.current = activeIndex

  const navigation = useCarouselNavigation({
    images,
    index: activeIndex,
    onIndexChange,
    disabled: isClosing,
    showNavigation: showNavigation && !renderControls
  })

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
    setIsClosing(true)
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
      setIsClosing(false)
      return
    }

    cancelPendingClose()
    setIsClosing(false)
    changeIndexRef.current(null)
  }, [cancelPendingClose])

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
    setIsClosing(false)
    if (activeIndexRef.current !== null) {
      changeIndexRef.current(null)
    }
  }, [cancelPendingClose])

  useEffect(() => {
    const request = closeRequestRef.current
    if (!request || activeIndex === request.index) return

    cancelPendingClose()
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

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
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
      onKeyDown={navigation.handleKeyDown}
    >
      <h2 className='react-pic-gallery__sr-only' id={titleId}>
        Image viewer
      </h2>
      <Carousel
        images={images}
        index={activeIndex}
        navigation={navigation}
        renderActions={renderActions}
        renderCaption={renderCaption}
        renderControls={renderControls}
        showCounter={showCounter}
        showNavigation={showNavigation && !renderControls}
        close={close}
        onEmptyAreaClick={close}
      />
    </dialog>,
    document.body
  )
}
