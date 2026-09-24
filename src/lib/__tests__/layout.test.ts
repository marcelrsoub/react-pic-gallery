import { describe, expect, it } from 'vitest'
import { buildJustifiedRows, FALLBACK_ASPECT_RATIO, getAspectRatio } from '../layout'

describe('gallery layout helpers', () => {
  it('uses supplied dimensions and falls back to a 3:2 image ratio', () => {
    expect(getAspectRatio({ width: 900, height: 600 })).toBe(1.5)
    expect(getAspectRatio({ width: 600, height: 900 })).toBeCloseTo(2 / 3)
    expect(getAspectRatio({})).toBe(FALLBACK_ASPECT_RATIO)
    expect(getAspectRatio({ width: 900, height: 0 })).toBe(FALLBACK_ASPECT_RATIO)
    expect(getAspectRatio({ width: Number.POSITIVE_INFINITY, height: 900 })).toBe(
      FALLBACK_ASPECT_RATIO
    )
  })

  it('fills complete justified rows and leaves the final row ragged', () => {
    const images = Array.from({ length: 6 }, () => ({ width: 1500, height: 1000 }))
    const rows = buildJustifiedRows(images, 900, 180, 12)

    expect(rows).toHaveLength(2)
    expect(rows[0].indices).toEqual([0, 1, 2])
    expect(rows[0].widths.reduce((sum, width) => sum + width, 24)).toBeCloseTo(900)
    expect(rows[1].indices).toEqual([3, 4, 5])
    expect(rows[1].widths.reduce((sum, width) => sum + width, 24)).toBeLessThan(900)
    expect(rows[1].height).toBe(180)
  })

  it('handles a single image and an empty list', () => {
    expect(buildJustifiedRows([], 900, 180, 12)).toEqual([])

    const [row] = buildJustifiedRows([{ width: 600, height: 900 }], 900, 180, 12)
    expect(row.indices).toEqual([0])
    expect(row.widths[0]).toBeCloseTo(120)
  })

  it('adapts row grouping to a narrower container', () => {
    const images = Array.from({ length: 6 }, () => ({ width: 1500, height: 1000 }))

    expect(buildJustifiedRows(images, 900, 180, 12).map((row) => row.indices.length)).toEqual([
      3,
      3
    ])
    expect(buildJustifiedRows(images, 500, 180, 12).map((row) => row.indices.length)).toEqual([
      2,
      2,
      2
    ])
  })
})
