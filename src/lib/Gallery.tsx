import { memo } from 'react'
import { Image } from './Image'
import type { GalleryImage, GalleryProps } from './types'

function GalleryComponent<T extends GalleryImage>({
  images,
  onImageClick,
  columns,
  rowHeight,
  className = '',
  style
}: GalleryProps<T>) {
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
          onClick={() => onImageClick?.(index)}
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
