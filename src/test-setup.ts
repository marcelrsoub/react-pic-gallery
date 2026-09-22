import '@testing-library/jest-dom/vitest'

if (typeof HTMLDialogElement !== 'undefined') {
  const dialogPrototype = HTMLDialogElement.prototype

  if (typeof dialogPrototype.showModal !== 'function') {
    Object.defineProperty(dialogPrototype, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute('open', '')
        this.querySelector<HTMLElement>('button, [href], input, select, textarea')?.focus()
      }
    })
  }

  if (typeof dialogPrototype.close !== 'function') {
    Object.defineProperty(dialogPrototype, 'close', {
      configurable: true,
      value() {
        this.removeAttribute('open')
        this.dispatchEvent(new Event('close'))
      }
    })
  }
}
