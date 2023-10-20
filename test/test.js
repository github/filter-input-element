import {assert} from '@open-wc/testing'
import {FilterInputElement} from '../src/index.ts'

describe('filter-input', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('filter-input')
      assert.equal('FILTER-INPUT', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new FilterInputElement()
      assert.equal('FILTER-INPUT', el.nodeName)
    })
  })

  describe('after tree insertion', function () {
    let filterInput
    let input
    let list
    let emptyState
    let newItem
    beforeEach(function () {
      document.body.innerHTML = `
        <filter-input aria-owns="robots">
          <label>
            Filter robots
            <input type="text" autofocus autocomplete="off">
          </label>
        </filter-input>
        <div id="robots">
          <ul data-filter-list>
            <li>Bender</li>
            <li>Hubot</li>
            <li>Wall-E</li>
            <li>BB-8</li>
          </ul>
          <p data-filter-empty-state hidden>0 robots found.</p>
          <form data-filter-new-item hidden>
            <button data-filter-new-item-value>Create "<span data-filter-new-item-text></span>"</button>
          </form>
        </div>
      `

      filterInput = document.querySelector('filter-input')
      input = filterInput.querySelector('input')
      list = document.querySelector('[data-filter-list]')
      emptyState = document.querySelector('[data-filter-empty-state]')
      newItem = document.querySelector('[data-filter-new-item]')
    })

    afterEach(function () {
      document.body.innerHTML = ''
    })

    it('filters and toggles new item form', async function () {
      const listener = once('filter-input-updated')
      changeValue(input, 'hu')
      const customEvent = await listener
      assert.equal(customEvent.detail.count, 1)
      assert.equal(customEvent.detail.total, 4)

      changeValue(input, 'BB-8 robot')
      assert.notOk(newItem.hidden, 'New item form should be shown')
      assert.equal(newItem.querySelector('[data-filter-new-item-value]').value, 'BB-8 robot')
      assert.equal(newItem.querySelector('[data-filter-new-item-text]').textContent, 'BB-8 robot')
    })

    it('filters and toggles blankslate', async function () {
      // Remove new item form, which is prioritized over blankslate
      newItem.remove()

      const listener = once('filter-input-updated')
      changeValue(input, 'hu')
      const customEvent = await listener
      const results = Array.from(list.children).filter(el => !el.hidden)
      assert.equal(results.length, 1)
      assert.equal(results[0].textContent, 'Hubot')
      assert.equal(customEvent.detail.count, 1)
      assert.equal(customEvent.detail.total, 4)
      changeValue(input, 'boom')
      assert.notOk(emptyState.hidden, 'Empty state should be shown')
    })

    it('filters with custom filter', async function () {
      filterInput.filter = (_item, itemText) => {
        return {match: itemText.indexOf('-') >= 0}
      }
      const listener = once('filter-input-updated')
      changeValue(input, ':)')
      const customEvent = await listener
      const results = Array.from(list.children).filter(el => !el.hidden)
      assert.equal(results.length, 2)
      assert.equal(results[0].textContent, 'Wall-E')
      assert.equal(customEvent.detail.count, 2)
      assert.equal(customEvent.detail.total, 4)
    })

    it('filters again with the same value when a change event is fired', async function () {
      const listener = once('filter-input-updated')
      changeValue(input, '-')
      const customEvent = await listener
      assert.equal(customEvent.detail.count, 2)
      assert.equal(customEvent.detail.total, 4)

      const newRobot = document.createElement('li')
      newRobot.textContent = 'R2-D2'
      list.append(newRobot)

      const listener2 = once('filter-input-updated')
      changeValue(input, '-')
      const customEvent2 = await listener2
      assert.equal(customEvent2.detail.count, 3)
      assert.equal(customEvent2.detail.total, 5)
    })
  })
})

function changeValue(input, value) {
  input.value = value
  input.dispatchEvent(new Event('change', {bubbles: true}))
}

function once(eventName) {
  return new Promise(resolve => {
    document.addEventListener(eventName, resolve, {once: true})
  })
}
