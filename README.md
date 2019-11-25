# &lt;filter-input&gt; element

Custom element used to create a filter input.

## Installation

```
$ npm install @github/filter-input-element
```

## Usage

```js
import '@github/filter-input-element'
```

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
