import type { GalleryImage } from './types'

export type ImageSource = {
  src: string
  srcSet?: string
  sizes?: string
}

export function getFullImageSource(image: GalleryImage): ImageSource {
  return {
    src: image.src,
    srcSet: image.srcSet,
    sizes: image.sizes
  }
}

export function getThumbnailImageSource(image: GalleryImage): ImageSource {
  const hasDedicatedThumbnail =
    image.thumbnailSrc !== undefined || image.thumbnailSrcSet !== undefined

  if (!hasDedicatedThumbnail) return getFullImageSource(image)

  return {
    src: image.thumbnailSrc ?? image.src,
    srcSet: image.thumbnailSrcSet,
    sizes: image.thumbnailSizes
  }
}

export function getImageSourceKey(source: ImageSource) {
  return JSON.stringify([source.src, source.srcSet ?? null, source.sizes ?? null])
}
