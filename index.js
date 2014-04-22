var model = require('./lib/Model');

//
// # getOrCreateModel
// *create or retrieve a model*
function getOrCreateModel(name) {
  var app = this;

  if(!app._models.hasOwnProperty(name)) {
    app._models[name] = model(name);
  }

  return app._models[name];
}

//
// ## getOrCreatePlugin
// *Create or retrieve a modella plugin*
//
// ### Examples:
// ```javascript
// // Register the 'modella-mongo' plugin as 'mongo'
// plugin('mongo', require('modella-mongo'));
//
// // Or, shorthand:
// plugin('mongo', 'modella-mongo');
//
// // Or, even shorter by using the module name:
// plugin('modella-mongo');
//
// // Access the 'mongo' plugin:
// var mongo = plugin('mongo');
//```
//
function getOrCreatePlugin(name, definition) {
  var app = this;
  var is  = app.utils.is;

  // [if]   Name is registered and plugin isn't provided.
  // [then] Return the plugin directly.
  if(name && app._modelPlugins[name] && !definition) {
    return app._modelPlugins[name];
  }

  // [if]   Both name and a definition object/function are provided.
  // [then] Register the definition and return `this` for chaining.
  if(name && definition && (is.object(definition) || is.fn(definition))) {
    app._modelPlugins[name] = definition;

    return this;
  }

  // [if]   Name is a string but isn't registered and definition isn't provided
  // [then] Require and register the definition and return `this` for chaining
  if(is.string(name) && !app._modelPlugins[name] && !definition) {
    definition = app.requireFn(name);
    if(definition) app._modelPlugins[name] = definition;

    return this;
  }

  // [if]   Name is a string but isn't registered and definition is a string
  // [then] Require the definition and register it using name.
  //        Returns `this` for chaining.
  if(is.string(name) && !app._modelPlugins[name] && is.string(definition)) {
    definition = app.requireFn(definition);
    if(definition) app._modelPlugins[name] = definition;

    return this;
  }

  // [else] Can't find the plugin, sorry pal.
  throw new Error('Plugin not found: ' + name);
}

//
// ## Register nails plugin
//
// Adds to App:
// `Object`   app._models            - Stores models loaded before the app has started
// `Object`   app._modelPlugins      - Stores model plugins for use via `app.model.plugin()`
// `Function` app.model(name)        - Create or retrieve a model
// `Function` app.model.plugin(name) - Create or retrieve a modella plugin
//
exports.name = 'model';
exports.type = 'integration';

exports.register = function(app, options, next) {
  app._models       = {};
  app._modelPlugins = {};
  app.model         = getOrCreateModel.bind(app);
  app.model.plugin  = getOrCreatePlugin.bind(app);

  next();
};
