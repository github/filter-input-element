describe('filter-input', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('filter-input')
      assert.equal('FILTER-INPUT', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.FilterInputElement()
      assert.equal('FILTER-INPUT', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    let filterInput, input, list, emptyState
    beforeEach(function() {
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
        </div>
      `

      filterInput = document.querySelector('filter-input')
      input = filterInput.querySelector('input')
      list = document.querySelector('[data-filter-list]')
      emptyState = document.querySelector('[data-filter-empty-state]')
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('filters', async function() {
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

    it('filters with custom filter', async function() {
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

    it('filters again with the same value when a change event is fired', async function() {
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
