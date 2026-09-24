import { useState } from 'react'
import { Gallery } from './Gallery'
import { Lightbox } from './Lightbox'
import type { GalleryImage, PicGalleryProps } from './types'

export function PicGallery<T extends GalleryImage>({
  images,
  layout,
  columns,
  rowHeight,
  className,
  galleryClassName,
  style,
  renderActions,
  renderCaption,
  renderControls,
  showCounter,
  showNavigation
}: PicGalleryProps<T>) {
  const [index, setIndex] = useState<number | null>(null)

  return (
    <div className={`react-pic-gallery ${className ?? ''}`.trim()} style={style}>
      <Gallery
        images={images}
        layout={layout}
        columns={columns}
        rowHeight={rowHeight}
        className={galleryClassName}
        onImageClick={setIndex}
      />
      <Lightbox
        images={images}
        index={index}
        onIndexChange={setIndex}
        renderActions={renderActions}
        renderCaption={renderCaption}
        renderControls={renderControls}
        showCounter={showCounter}
        showNavigation={showNavigation}
      />
    </div>
  )
}
