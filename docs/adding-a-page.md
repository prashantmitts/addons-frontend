# addons-frontend

This will outline what is required to add a page to the project. A basic knowledge of
[react](https://facebook.github.io/react/docs/getting-started.html) and
[redux](http://redux.js.org/) is assumed.

**Note:** This page contained detailed instructions that were quite out-dated and have since been removed. We now use [redux-saga](https://github.com/redux-saga/redux-saga) for API requests. See `amo/components/Categories.js` for a more modern example of a component that makes API/async requests for data.

### Styling the page

To style your page you just need to import your SCSS file in your component. All of the CSS will
be transpiled and minified into a single bundle in production so you will still need to namespace
your styles.

```js
// src/search/containers/AddonPage/index.js
// Add this line with the other imports.
import './styles.scss';
```

```scss
// src/search/containers/AddonPage/styles.scss
.user-page {
  h1 {
    text-decoration: underline;
  }
  li {
    text-transform: uppercase;
  }
}
```
