interface MatchFunction {
  (item: HTMLElement, itemText: string, query: string): MatchResult
}

interface MatchResult {
  match: boolean
  hideNew?: boolean
}

export class FilterInputElement extends HTMLElement {
  static define(tag = 'filter-input', registry = customElements) {
    registry.define(tag, this)
    return this
  }

  currentQuery: string | null = null
  debounceInputChange: () => void = debounce(() => filterResults(this, true))
  boundFilterResults: () => void = () => {
    filterResults(this, false)
  }
  filter: MatchFunction | null = null

  static get observedAttributes() {
    return ['aria-owns']
  }

  attributeChangedCallback(name: string, oldValue: string) {
    if (oldValue && name === 'aria-owns') {
      filterResults(this, false)
    }
  }

  connectedCallback() {
    const input = this.input
    if (!input) return

    input.setAttribute('autocomplete', 'off')
    input.setAttribute('spellcheck', 'false')

    input.addEventListener('focus', this.boundFilterResults)
    input.addEventListener('change', this.boundFilterResults)
    input.addEventListener('input', this.debounceInputChange)
  }

  disconnectedCallback() {
    const input = this.input
    if (!input) return

    input.removeEventListener('focus', this.boundFilterResults)
    input.removeEventListener('change', this.boundFilterResults)
    input.removeEventListener('input', this.debounceInputChange)
  }

  get input(): HTMLInputElement | null {
    const input = this.querySelector('input')
    return input instanceof HTMLInputElement ? input : null
  }

  reset() {
    const input = this.input
    if (input) {
      input.value = ''
      input.dispatchEvent(new Event('change', {bubbles: true}))
    }
  }
}

async function filterResults(filterInput: FilterInputElement, checkCurrentQuery: boolean = false) {
  const input = filterInput.input
  if (!input) return
  const query = input.value.trim()
  const id = filterInput.getAttribute('aria-owns')
  if (!id) return
  const container = document.getElementById(id)
  if (!container) return
  const list = container.hasAttribute('data-filter-list') ? container : container.querySelector('[data-filter-list]')
  if (!list) return

  filterInput.dispatchEvent(
    new CustomEvent('filter-input-start', {
      bubbles: true,
    }),
  )

  if (checkCurrentQuery && filterInput.currentQuery === query) return
  filterInput.currentQuery = query

  const filter = filterInput.filter || matchSubstring
  const total = list.childElementCount
  let count = 0
  let hideNew = false

  for (const item of Array.from(list.children)) {
    if (!(item instanceof HTMLElement)) continue
    const itemText = getText(item)
    const result = filter(item, itemText, query)
    if (result.hideNew === true) hideNew = result.hideNew

    item.hidden = !result.match
    if (result.match) count++
  }

  const newItem = container.querySelector('[data-filter-new-item]')
  const showCreateOption = !!newItem && query.length > 0 && !hideNew
  if (newItem instanceof HTMLElement) {
    newItem.hidden = !showCreateOption
    if (showCreateOption) updateNewItem(newItem, query)
  }

  toggleBlankslate(container, count > 0 || showCreateOption)

  filterInput.dispatchEvent(
    new CustomEvent('filter-input-updated', {
      bubbles: true,
      detail: {
        count,
        total,
      },
    }),
  )
}

function matchSubstring(_item: HTMLElement, itemText: string, query: string): MatchResult {
  const match = itemText.toLowerCase().indexOf(query.toLowerCase()) !== -1
  return {
    match,
    hideNew: itemText === query,
  }
}

function getText(filterableItem: HTMLElement) {
  const target = filterableItem.querySelector('[data-filter-item-text]') || filterableItem
  return (target.textContent || '').trim()
}

function updateNewItem(newItem: HTMLElement, query: string) {
  const newItemText = newItem.querySelector('[data-filter-new-item-text]')
  if (newItemText) newItemText.textContent = query
  const newItemValue = newItem.querySelector('[data-filter-new-item-value]')
  if (newItemValue instanceof HTMLInputElement || newItemValue instanceof HTMLButtonElement) {
    newItemValue.value = query
  }
}

function toggleBlankslate(container: HTMLElement, force: boolean) {
  const emptyState = container.querySelector('[data-filter-empty-state]')
  if (emptyState instanceof HTMLElement) emptyState.hidden = force
}

function debounce(callback: () => void) {
  let timeout: ReturnType<typeof setTimeout>
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      clearTimeout(timeout)
      callback()
    }, 300)
  }
}

export default FilterInputElement
