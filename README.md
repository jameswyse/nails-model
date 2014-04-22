![nails-framework](https://f.cloud.github.com/assets/1144357/2225403/4529567e-9a8d-11e3-80a4-23ba637b5f26.png)

# nails-model
*Model support for [nails-framework](http://ghub.io/nails-framework)*

Powered by [Modella](http://ghub.io/modella)

## Install
```bash
$ npm install --save nails-model
```

## Defining Models
```javascript
// Load the plugin before calling app.start()
app.plugin('nails-model');

// Create a model
app.model('Post')
  // Use the 'modella-validation' plugin
  .plugin(model.plugin('modella-validation'))
  // Add some attributes
  .attr('title', { type: 'string', required: true })
  .attr('body',  { type: 'string' });
```

## Working with instances
```javascript
var Post = app.model('Post');

// Create a new Post
var post = new Post({
  title: 'Hello World',
  body: 'This is my post'
});

post.save(function(err) {
  if(err) throw err;
});
```

See the [Modella Documentation](https://github.com/modella/modella#modella-) for more details.

## Licence

The MIT License (MIT)

Copyright (c) 2014 James Wyse <james@jameswyse.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
