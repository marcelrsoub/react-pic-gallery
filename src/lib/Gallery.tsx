import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react'
import { Image } from './Image'
import { buildJustifiedRows } from './layout'
import type { GalleryImage, GalleryProps } from './types'

const DEFAULT_COLUMNS = 3
const DEFAULT_ROW_HEIGHT = 192
const DEFAULT_GAP = 12
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

type TileOptions = {
  className?: string
  style?: CSSProperties
}

function GalleryComponent<T extends GalleryImage>({
  images,
  onImageClick,
  layout = 'grid',
  columns,
  rowHeight,
  className = '',
  style
}: GalleryProps<T>) {
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([])
  const galleryRef = useRef<HTMLDivElement>(null)
  const heightProbeRef = useRef<HTMLSpanElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [measurements, setMeasurements] = useState({
    width: 1024,
    rowHeight: DEFAULT_ROW_HEIGHT,
    gap: DEFAULT_GAP
  })
  const columnCount =
    columns !== undefined && Number.isFinite(columns) && columns >= 1
      ? Math.floor(columns)
      : DEFAULT_COLUMNS
  const lastIndex = images.length - 1
  const rovingIndex = Math.min(focusedIndex, Math.max(lastIndex, 0))
  const rowHeightValue =
    typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight

  const galleryStyle = {
    ...style,
    ...(layout === 'grid' && columns !== undefined && Number.isFinite(columns) && columns >= 1
      ? { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }
      : {}),
    ...(rowHeightValue ? { '--gallery-row-height': rowHeightValue } : {})
  } as CSSProperties & Record<string, string | number>

  useIsomorphicLayoutEffect(() => {
    if (layout !== 'justified') return

    const gallery = galleryRef.current
    const probe = heightProbeRef.current
    if (!gallery || !probe) return

    const measure = () => {
      const rect = gallery.getBoundingClientRect()
      const width = rect.width || gallery.clientWidth || window.innerWidth || 1024
      const probeRect = probe.getBoundingClientRect()
      const computedGap = Number.parseFloat(window.getComputedStyle(probe).width)
      const fallbackHeight =
        typeof rowHeight === 'number'
          ? rowHeight
          : typeof rowHeight === 'string' && /^\s*\d+(?:\.\d+)?px\s*$/.test(rowHeight)
            ? Number.parseFloat(rowHeight)
            : DEFAULT_ROW_HEIGHT

      setMeasurements((previous) => {
        const next = {
          width,
          rowHeight: probeRect.height || fallbackHeight,
          gap: Number.isFinite(computedGap) ? computedGap : probeRect.width || DEFAULT_GAP
        }
        return previous.width === next.width &&
          previous.rowHeight === next.rowHeight &&
          previous.gap === next.gap
          ? previous
          : next
      })
    }

    measure()
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(gallery)
    observer?.observe(probe)
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [layout, rowHeight, rowHeightValue])

  const moveTileFocus = useCallback((index: number) => {
    setFocusedIndex(index)
    tileRefs.current[index]?.focus()
  }, [])

  const findVerticalNeighbor = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const current = tileRefs.current[index]
      if (!current) return null

      const currentRect = current.getBoundingClientRect()
      if (
        layout === 'mosaic' &&
        current.classList.contains('react-pic-gallery__tile--mosaic-featured')
      ) {
        const group = current.closest('.react-pic-gallery__mosaic-group')
        const centerX = currentRect.left + currentRect.width / 2
        const centerY = currentRect.top + currentRect.height / 2
        let nearestIndex: number | null = null
        let nearestScore = Number.POSITIVE_INFINITY

        tileRefs.current.slice(0, images.length).forEach((candidate, candidateIndex) => {
          if (!candidate || candidateIndex === index || !group?.contains(candidate)) return
          const rect = candidate.getBoundingClientRect()
          const x = rect.left + rect.width / 2
          const y = rect.top + rect.height / 2
          const verticalDistance = direction === 'up' ? centerY - y : y - centerY
          if (verticalDistance <= 0) return

          const score = verticalDistance + Math.abs(x - centerX)
          if (score < nearestScore) {
            nearestScore = score
            nearestIndex = candidateIndex
          }
        })

        if (nearestIndex !== null) return nearestIndex
      }

      let nearestIndex: number | null = null
      let nearestScore = Number.POSITIVE_INFINITY

      tileRefs.current.slice(0, images.length).forEach((candidate, candidateIndex) => {
        if (!candidate || candidateIndex === index) return
        const rect = candidate.getBoundingClientRect()
        const verticalDistance =
          direction === 'up'
            ? currentRect.top - rect.bottom
            : rect.top - currentRect.bottom
        if (verticalDistance < 0) return

        const horizontalDistance =
          rect.right < currentRect.left
            ? currentRect.left - rect.right
            : currentRect.right < rect.left
              ? rect.left - currentRect.right
              : 0
        const score = verticalDistance + horizontalDistance
        if (score < nearestScore) {
          nearestScore = score
          nearestIndex = candidateIndex
        }
      })

      return nearestIndex
    },
    [images.length, layout]
  )

  const handleTileKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      let next: number | null = null

      if (event.key === 'Home') {
        next = 0
      } else if (event.key === 'End') {
        next = lastIndex
      } else if (layout === 'grid') {
        const deltas: Record<string, number> = {
          ArrowRight: 1,
          ArrowLeft: -1,
          ArrowDown: columnCount,
          ArrowUp: -columnCount
        }
        const delta = deltas[event.key]
        if (delta !== undefined) {
          const candidate = index + delta
          if (candidate >= 0 && candidate <= lastIndex) next = candidate
        }
      } else if (event.key === 'ArrowRight' && index < lastIndex) {
        next = index + 1
      } else if (event.key === 'ArrowLeft' && index > 0) {
        next = index - 1
      } else if (event.key === 'ArrowDown') {
        next = findVerticalNeighbor(index, 'down')
      } else if (event.key === 'ArrowUp') {
        next = findVerticalNeighbor(index, 'up')
      } else {
        return
      }

      if (next === null || next === index) return
      event.preventDefault()
      moveTileFocus(next)
    },
    [columnCount, findVerticalNeighbor, lastIndex, layout, moveTileFocus]
  )

  const renderTile = (image: T, index: number, options: TileOptions = {}) => (
    <button
      className={`react-pic-gallery__tile ${options.className ?? ''}`.trim()}
      type='button'
      disabled={!onImageClick}
      key={image.id ?? `${image.src}-${index}`}
      tabIndex={index === rovingIndex ? 0 : -1}
      ref={(element) => {
        tileRefs.current[index] = element
      }}
      style={options.style}
      onKeyDown={(event) => handleTileKeyDown(event, index)}
      onClick={() => {
        setFocusedIndex(index)
        onImageClick?.(index)
      }}
      aria-label={`Open ${image.alt}`}
    >
      <Image
        src={image.thumbnailSrc ?? image.src}
        alt={image.alt}
        objectFit='cover'
        width={image.width}
        height={image.height}
      />
    </button>
  )

  const justifiedRows =
    layout === 'justified'
      ? buildJustifiedRows(
          images,
          measurements.width,
          measurements.rowHeight,
          measurements.gap
        )
      : []
  const justifiedTileStyles: Array<CSSProperties | undefined> = Array(images.length)
  justifiedRows.forEach((row) => {
    row.indices.forEach((index, columnIndex) => {
      justifiedTileStyles[index] = {
        width: `${row.widths[columnIndex]}px`,
        height: `${row.height}px`
      }
    })
  })

  return (
    <div
      ref={galleryRef}
      className={`react-pic-gallery__gallery react-pic-gallery__gallery--${layout} ${
        layout === 'grid' ? 'react-pic-gallery__grid' : ''
      } ${className}`.trim()}
      style={galleryStyle}
      data-testid={layout === 'grid' ? 'react-pic-gallery-grid' : undefined}
      data-layout={layout}
    >
      {layout === 'grid' && images.map((image, index) => renderTile(image, index))}

      {layout === 'justified' && (
        <>
          {images.map((image, index) =>
            renderTile(image, index, {
              className: 'react-pic-gallery__tile--justified',
              style: justifiedTileStyles[index]
            })
          )}
          <span
            ref={heightProbeRef}
            className='react-pic-gallery__row-height-probe'
            aria-hidden='true'
          />
        </>
      )}

      {layout === 'mosaic' &&
        Array.from({ length: Math.ceil(images.length / 3) }, (_, groupIndex) => {
          const groupStart = groupIndex * 3
          const group = images.slice(groupStart, groupStart + 3)
          const pattern = groupIndex % 2 === 0 ? 'left' : 'top'
          return (
            <div
              className={`react-pic-gallery__mosaic-group react-pic-gallery__mosaic-group--${pattern} react-pic-gallery__mosaic-group--count-${group.length}`}
              key={`mosaic-${groupStart}`}
            >
              {group.map((image, groupOffset) => {
                const index = groupStart + groupOffset
                const role = group.length === 3
                  ? groupOffset === 0 ? 'featured' : 'supporting'
                  : 'simple'
                return renderTile(image, index, {
                  className: `react-pic-gallery__tile--mosaic react-pic-gallery__tile--mosaic-${role}`
                })
              })}
            </div>
          )
        })}
    </div>
  )
}

export const Gallery = memo(GalleryComponent) as typeof GalleryComponent
