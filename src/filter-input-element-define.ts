import {FilterInputElement} from './filter-input-element.js'

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window
try {
  root.FilterInputElement = FilterInputElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}

type JSXBase = JSX.IntrinsicElements extends {span: unknown}
  ? JSX.IntrinsicElements
  : Record<string, Record<string, unknown>>
declare global {
  interface Window {
    FilterInputElement: typeof FilterInputElement
  }
  interface HTMLElementTagNameMap {
    'filter-input': FilterInputElement
  }
  namespace JSX {
    interface IntrinsicElements {
      ['filter-input']: JSXBase['span'] & Partial<Omit<FilterInputElement, keyof HTMLElement>>
    }
  }
}

export default FilterInputElement
export * from './filter-input-element.js'
