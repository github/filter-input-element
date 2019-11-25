class FilterInputElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.textContent = ':wave:'
  }
}

export default FilterInputElement

declare global {
  interface Window {
    FilterInputElement: typeof FilterInputElement
  }
}

if (!window.customElements.get('filter-input')) {
  window.FilterInputElement = FilterInputElement
  window.customElements.define('filter-input', FilterInputElement)
}
