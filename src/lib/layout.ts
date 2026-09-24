import type { GalleryImage } from './types'

export const FALLBACK_ASPECT_RATIO = 3 / 2

export type JustifiedRow = {
  indices: number[]
  widths: number[]
  height: number
}

export function getAspectRatio(image: Pick<GalleryImage, 'width' | 'height'>) {
  return Number.isFinite(image.width) &&
    Number.isFinite(image.height) &&
    image.width !== undefined &&
    image.height !== undefined &&
    image.width > 0 &&
    image.height > 0
    ? image.width / image.height
    : FALLBACK_ASPECT_RATIO
}

export function buildJustifiedRows(
  images: readonly Pick<GalleryImage, 'width' | 'height'>[],
  containerWidth: number,
  targetHeight: number,
  gap: number
): JustifiedRow[] {
  if (images.length === 0) return []

  const availableWidth = Math.max(1, containerWidth)
  const desiredHeight = Math.max(1, targetHeight)
  const spacing = Math.max(0, gap)
  const ratios = images.map(getAspectRatio)
  const rows: JustifiedRow[] = []
  let start = 0

  while (start < images.length) {
    let bestEnd = start + 1
    let bestHeight = availableWidth / ratios[start]
    let bestDifference = Math.abs(bestHeight - desiredHeight)
    let ratioSum = ratios[start]

    for (let end = start + 1; end < images.length; end += 1) {
      const nextRatioSum = ratioSum + ratios[end]
      const candidateCount = end - start + 1
      const candidateHeight =
        (availableWidth - spacing * (candidateCount - 1)) / nextRatioSum
      const difference = Math.abs(candidateHeight - desiredHeight)

      if (difference < bestDifference) {
        bestEnd = end + 1
        bestHeight = candidateHeight
        bestDifference = difference
      } else if (candidateHeight < desiredHeight) {
        break
      }

      ratioSum = nextRatioSum
    }

    const count = bestEnd - start
    const sum = ratios.slice(start, bestEnd).reduce((total, ratio) => total + ratio, 0)
    const rowHeight = bestEnd === images.length
      ? Math.min(desiredHeight, (availableWidth - spacing * (count - 1)) / sum)
      : bestHeight

    rows.push({
      indices: Array.from({ length: count }, (_, offset) => start + offset),
      widths: ratios.slice(start, bestEnd).map((ratio) => ratio * rowHeight),
      height: rowHeight
    })
    start = bestEnd
  }

  return rows
}
