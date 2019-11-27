# &lt;filter-input&gt; element

Display elements in a subtree that match filter input text.

## Installation

```
$ npm install @github/filter-input-element
```

## Usage

```html
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
    <li>R2-D2</li>
  </ul>
  <p data-filter-empty-state hidden>0 robots found.</p>
</div>
```

## Elements and attributes

### Required

- `filter-input[aria-owns]` should point to the container ID that wraps all `<filter-input>` related elements.
- `filter-input` should have one `input` child element that is used to filter.
- `[id]` should be set on a container that either contains or has `[data-filter-list]` attribute.
- `[data-filter-list]` should be set on the element whose **direct child elements** are to be filtered.

### Optional

#### Specify filter text

Use `[data-filter-item-text]` to specify an element whose text should be used for filtering. In the following example, the text `(current)` would not be matched.

```html
<div data-filter-list>
  <a href="/bender">Bender</a>
  <a href="/hubot">
    <span data-filter-item-text>Hubot</span>
    (current)
  </a>
</div>
```

#### Blankslate

Use `[data-filter-empty-state]` to specify an element to be displayed when no results were found. This element must be inside of the container `aria-owns` points to.

```html
<div id="filter-list">
  <div data-filter-list>
    <a href="/bender">Bender</a>
    <a href="/hubot">Hubot</a>
  </div>
  <div data-filter-empty-state hidden>No results found.</div>
</div>
```

#### Create new actions

Use `[data-filter-new-item]` to include an item to create a new instance when no exact match were found. The element with `[data-filter-new-text]`'s text content will be set to the input value. You can also use `[data-filter-new-value]` to set an input value to the query param.

```html
<div id="filter-list">
  <div data-filter-list>
    <a href="/bender">Bender</a>
    <a href="/hubot">Hubot</a>
  </div>
  <a href="/new" data-filter-new-item hidden>
    Create new robot named "<span data-filter-new-item-text></span>"
  </a>
</div>
```

## Methods

`filterInputElement.filter` can be optionally set to provide an alternative filtering logic. The default is substring.

```js
const fuzzyFilterInput = document.querySelector('.js-fuzzy-filter-input')
fuzzyFilterInput.filter = (element, elementText, query) => {
  // fuzzy filtering logic
  return {match: boolean, hideNew: boolean}
}
```

## Events

- `filter-input-start` (bubbles) - fired on `<filter-input>` when a filter action is about to start.
- `filter-input-updated` (bubbles) - fired on `<filter-input>` when filter has finished. `event.detail.count` is the number of matches found, and `event.detail.total` is the total number of elements.

To ensure that the client side update is communicated to assistive technologies, `filter-input-updated` event can be used to update filter results to screen readers. For example:

```js
const ariaLiveContainer = document.querySelector('[aria-live="assertive"]')
document.addEventListener('filter-input-updated', event => {
  ariaLiveContainer.textContent = `${event.detail.count} results found.`
})
```

For more details on this technique, check out [Improving accessibility on GOV.UK search](https://technology.blog.gov.uk/2014/08/14/improving-accessibility-on-gov-uk-search/).

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

- Chrome
- Firefox
- Safari
- Microsoft Edge

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
