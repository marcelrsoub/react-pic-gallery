import {
  memo,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react'
import { Image } from './Image'
import type { GalleryImage, GalleryProps } from './types'

const DEFAULT_COLUMNS = 3

function GalleryComponent<T extends GalleryImage>({
  images,
  onImageClick,
  columns,
  rowHeight,
  className = '',
  style
}: GalleryProps<T>) {
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const columnCount = columns && columns > 0 ? columns : DEFAULT_COLUMNS
  const lastIndex = images.length - 1
  const rovingIndex = Math.min(focusedIndex, Math.max(lastIndex, 0))

  const moveTileFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index)
      tileRefs.current[index]?.focus()
    },
    []
  )

  const handleTileKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      const deltas: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: columnCount,
        ArrowUp: -columnCount
      }
      const delta = deltas[event.key]
      let next: number | null = null

      if (delta !== undefined) {
        const candidate = index + delta
        if (candidate >= 0 && candidate <= lastIndex) next = candidate
      } else if (event.key === 'Home') {
        next = 0
      } else if (event.key === 'End') {
        next = lastIndex
      } else {
        return
      }

      if (next === null || next === index) return

      event.preventDefault()
      moveTileFocus(next)
    },
    [columnCount, lastIndex, moveTileFocus]
  )

  const rowHeightValue =
    typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight
  const gridStyle = {
    ...style,
    ...(columns
      ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
      : {}),
    ...(rowHeightValue ? { '--gallery-row-height': rowHeightValue } : {})
  } as typeof style & Record<string, string | number>

  return (
    <div
      className={`react-pic-gallery__grid ${className}`.trim()}
      style={gridStyle}
      data-testid='react-pic-gallery-grid'
    >
      {images.map((image, index) => (
        <button
          className='react-pic-gallery__tile'
          type='button'
          disabled={!onImageClick}
          key={image.id ?? `${image.src}-${index}`}
          tabIndex={index === rovingIndex ? 0 : -1}
          ref={(element) => {
            tileRefs.current[index] = element
          }}
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
      ))}
    </div>
  )
}

export const Gallery = memo(GalleryComponent) as typeof GalleryComponent
