export const interactiveControlSelector =
  'a[href], button, input, select, textarea, [role="combobox"], [role="menu"], [role="slider"], [role="spinbutton"], [role="tab"]'
export const keyboardInteractiveControlSelector =
  'input, select, textarea, [role="combobox"], [role="menu"], [role="slider"], [role="spinbutton"], [role="tab"]'
export const edgeTapMediaQuery = '(max-width: 600px), (pointer: coarse)'
export const edgeTapZoneRatio = 0.3

export function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest(interactiveControlSelector) !== null
}

export function getEdgeTapZone(clientX: number, viewport: HTMLElement | null) {
  if (!viewport || window.matchMedia?.(edgeTapMediaQuery)?.matches !== true) return null
  const rect = viewport.getBoundingClientRect()
  if (rect.width <= 0) return null
  const ratio = (clientX - rect.left) / rect.width
  if (ratio < edgeTapZoneRatio) return 'previous' as const
  if (ratio > 1 - edgeTapZoneRatio) return 'next' as const
  return null
}

export function CloseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  )
}

export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path d={direction === 'left' ? 'M14.5 5l-7 7 7 7' : 'M9.5 5l7 7-7 7'} />
    </svg>
  )
}

export function joinClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}
