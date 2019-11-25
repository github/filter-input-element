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
    beforeEach(function() {
      document.body.innerHTML = '<filter-input></filter-input>'
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('initiates', function() {
      const ce = document.querySelector('filter-input')
      assert.equal(ce.textContent, ':wave:')
    })
  })
})
