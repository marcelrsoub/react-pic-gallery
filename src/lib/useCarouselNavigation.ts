import { useCallback, useRef, useState, type AnimationEvent as ReactAnimationEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from 'react'
import type { GalleryImage } from './types'
import { getEdgeTapZone, isInteractiveTarget, keyboardInteractiveControlSelector } from './utils'

export type UseCarouselNavigationOptions<T extends GalleryImage> = {
  images: readonly T[]
  index: number | null
  onIndexChange: (index: number | null) => void
  disabled?: boolean
  showNavigation?: boolean
}

export type UseCarouselNavigationResult = {
  previous: () => void
  next: () => void
  swipeDirection: 'next' | 'previous' | null
  handleKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
  handleTouchStart: (event: ReactTouchEvent<HTMLElement>) => void
  handleTouchEnd: (event: ReactTouchEvent<HTMLElement>) => void
  handleTouchCancel: () => void
  handleImageAnimationEnd: (event: ReactAnimationEvent<HTMLElement>) => void
  handleViewportClick: (event: ReactMouseEvent<HTMLElement>) => void
}

export function useCarouselNavigation<T extends GalleryImage>(options: UseCarouselNavigationOptions<T>): UseCarouselNavigationResult {
  const { images, index, onIndexChange, disabled = false, showNavigation = true } = options
  const imagesRef = useRef(images)
  const indexRef = useRef(index)
  const onIndexChangeRef = useRef(onIndexChange)
  const disabledRef = useRef(disabled)
  const showNavigationRef = useRef(showNavigation)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'next' | 'previous' | null>(null)
  imagesRef.current = images
  indexRef.current = index
  onIndexChangeRef.current = onIndexChange
  disabledRef.current = disabled
  showNavigationRef.current = showNavigation

  const previous = useCallback(() => {
    const currentIndex = indexRef.current
    if (!disabledRef.current && currentIndex !== null && currentIndex > 0) onIndexChangeRef.current(currentIndex - 1)
  }, [])
  const next = useCallback(() => {
    const currentIndex = indexRef.current
    if (!disabledRef.current && currentIndex !== null && currentIndex < imagesRef.current.length - 1) onIndexChangeRef.current(currentIndex + 1)
  }, [])
  const swipePrevious = useCallback(() => {
    const currentIndex = indexRef.current
    if (disabledRef.current || currentIndex === null || currentIndex === 0) return
    setSwipeDirection('previous')
    onIndexChangeRef.current(currentIndex - 1)
  }, [])
  const swipeNext = useCallback(() => {
    const currentIndex = indexRef.current
    if (disabledRef.current || currentIndex === null || currentIndex >= imagesRef.current.length - 1) return
    setSwipeDirection('next')
    onIndexChangeRef.current(currentIndex + 1)
  }, [])
  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return
    const target = event.target
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest(keyboardInteractiveControlSelector))) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }, [next, previous])
  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1 || isInteractiveTarget(event.target)) {
      touchStartRef.current = null
      return
    }
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])
  const handleTouchEnd = useCallback((event: ReactTouchEvent<HTMLElement>) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (disabledRef.current || !start || event.changedTouches.length === 0) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const horizontalDistance = Math.abs(deltaX)
    if (horizontalDistance < 48 || horizontalDistance <= Math.abs(deltaY)) return
    if (deltaX < 0) swipeNext()
    else swipePrevious()
  }, [swipeNext, swipePrevious])
  const handleTouchCancel = useCallback(() => { touchStartRef.current = null }, [])
  const handleImageAnimationEnd = useCallback((event: ReactAnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) setSwipeDirection(null)
  }, [])
  const handleViewportClick = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (!showNavigationRef.current || imagesRef.current.length <= 1 || disabledRef.current) return
    if (!(event.target instanceof Element) || event.target.closest('button')) return
    const zone = getEdgeTapZone(event.clientX, event.currentTarget)
    if (zone === 'previous') previous()
    else if (zone === 'next') next()
  }, [next, previous])

  return { previous, next, swipeDirection, handleKeyDown, handleTouchStart, handleTouchEnd, handleTouchCancel, handleImageAnimationEnd, handleViewportClick }
}
