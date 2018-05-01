# sails-hook-route

How to use :

1) In your config/routes.js file, add a name property for a route you want to be named :

```js
// Some routes
'GET /foo/:id': {
  name: 'foo',
  controller: 'SomeController',
  action: 'bar'
// Some routes
}
```

2) In your template file :

```ejs
<a href="<%= route('foo', 5) %>">Foo</a>
```

and it will produce

```html
<a href="/foo/5">Foo</a>
```
