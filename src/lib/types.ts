import type { CSSProperties, ReactNode } from 'react'

export type GalleryImage = {
  id?: string
  src: string
  thumbnailSrc?: string
  alt: string
  caption?: ReactNode
  width?: number
  height?: number
}

export type LightboxContext<T extends GalleryImage = GalleryImage> = {
  image: T
  index: number
  count: number
  close: () => void
  next: () => void
  previous: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export type LightboxRenderer<T extends GalleryImage = GalleryImage> = (
  context: LightboxContext<T>
) => ReactNode

export type GalleryProps<T extends GalleryImage = GalleryImage> = {
  images: readonly T[]
  onImageClick?: (index: number) => void
  columns?: number
  rowHeight?: CSSProperties['height']
  className?: string
  style?: CSSProperties
}

export type LightboxProps<T extends GalleryImage = GalleryImage> = {
  images: readonly T[]
  index: number | null
  onIndexChange: (index: number | null) => void
  renderActions?: LightboxRenderer<T>
  renderCaption?: LightboxRenderer<T>
  renderControls?: LightboxRenderer<T>
  showCounter?: boolean
  showNavigation?: boolean
  className?: string
}

export type PicGalleryProps<T extends GalleryImage = GalleryImage> = {
  images: readonly T[]
  columns?: number
  rowHeight?: CSSProperties['height']
  className?: string
  galleryClassName?: string
  style?: CSSProperties
  renderActions?: LightboxRenderer<T>
  renderCaption?: LightboxRenderer<T>
  renderControls?: LightboxRenderer<T>
  showCounter?: boolean
  showNavigation?: boolean
}
