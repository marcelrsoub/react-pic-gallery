import { useEffect } from 'react'
import type { GalleryImage } from './types'
import { getFullImageSource, getImageSourceKey } from './imageSources'

const MAX_TRACKED_PRELOADS = 32

type PreloadEntry = {
  key: string
  status: 'pending' | 'loaded'
  image: HTMLImageElement | null
  owners: Set<symbol>
  onLoad: () => void
  onError: () => void
}

const preloadEntries = new Map<string, PreloadEntry>()

function removeListeners(entry: PreloadEntry) {
  if (!entry.image) return
  entry.image.removeEventListener('load', entry.onLoad)
  entry.image.removeEventListener('error', entry.onError)
  entry.image = null
}

function evictEntry(entry: PreloadEntry) {
  removeListeners(entry)
  if (preloadEntries.get(entry.key) === entry) preloadEntries.delete(entry.key)
}

function makeRoom() {
  while (preloadEntries.size >= MAX_TRACKED_PRELOADS) {
    const oldestUnused = [...preloadEntries.values()].find(
      (entry) => entry.owners.size === 0
    )
    if (!oldestUnused) return false
    evictEntry(oldestUnused)
  }
  return true
}

function touchEntry(entry: PreloadEntry) {
  preloadEntries.delete(entry.key)
  preloadEntries.set(entry.key, entry)
}

function acquirePreload(source: ReturnType<typeof getFullImageSource>, owner: symbol) {
  if (!source.src.trim()) return null

  const key = getImageSourceKey(source)
  const existing = preloadEntries.get(key)
  if (existing) {
    existing.owners.add(owner)
    touchEntry(existing)
    return existing
  }

  if (typeof Image === 'undefined' || !makeRoom()) return null

  const image = new Image()
  const entry: PreloadEntry = {
    key,
    status: 'pending',
    image,
    owners: new Set([owner]),
    onLoad: () => {},
    onError: () => {}
  }

  entry.onLoad = () => {
    if (preloadEntries.get(key) !== entry) return
    entry.status = 'loaded'
    removeListeners(entry)
  }
  entry.onError = () => {
    if (preloadEntries.get(key) !== entry) return
    evictEntry(entry)
  }
  preloadEntries.set(key, entry)

  image.addEventListener('load', entry.onLoad)
  image.addEventListener('error', entry.onError)
  image.fetchPriority = 'low'

  try {
    if (source.sizes !== undefined) image.sizes = source.sizes
    if (source.srcSet !== undefined) image.srcset = source.srcSet
    image.src = source.src
  } catch {
    evictEntry(entry)
  }

  return entry
}

function releasePreload(entry: PreloadEntry, owner: symbol) {
  entry.owners.delete(owner)
  if (entry.status === 'pending' && entry.owners.size === 0) {
    evictEntry(entry)
  }
}

export function useAdjacentImagePreload<T extends GalleryImage>(
  images: readonly T[],
  index: number,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || images.length < 2 || index < 0 || index >= images.length) return

    const owner = Symbol('adjacent-image-preload')
    const uniqueSources = new Map<string, ReturnType<typeof getFullImageSource>>()

    for (const neighborIndex of [index - 1, index + 1]) {
      if (neighborIndex < 0 || neighborIndex >= images.length) continue
      const source = getFullImageSource(images[neighborIndex])
      uniqueSources.set(getImageSourceKey(source), source)
    }

    const acquired = [...uniqueSources.values()]
      .map((source) => acquirePreload(source, owner))
      .filter((entry): entry is PreloadEntry => entry !== null)

    return () => {
      acquired.forEach((entry) => releasePreload(entry, owner))
    }
  }, [enabled, images, index])
}

/** Internal reset hook for isolated unit tests. */
export function resetAdjacentImagePreloadCache() {
  for (const entry of preloadEntries.values()) evictEntry(entry)
}
