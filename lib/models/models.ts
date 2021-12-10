// 1. Types Declaration

export interface ImageObject {
  fullSrc: string
  thumbnailSrc: string
  [key: string]: string
}

export interface Options {
  externalLightbox?: boolean
  customLoadComponent?: () => JSX.Element
  hidePagination?: boolean
  rowHeight?: string | number
  /** Number of Pictures per row. Default: 3 */
  picsPerRow?: number
}

// 2 Default Options

export const defaultOptions = {
  downloadBtnDisplay: true,
  descriptionBoxDisplay: true,
  navigation: true
}
