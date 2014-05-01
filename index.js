var model = require('./lib/model');

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
// `options` is optional
//
// ### Examples:
// ```javascript
// // Register the 'modella-mongo' plugin as 'mongo' with options
// plugin('mongo', {
//   module: require('modella-mongo'),
//   options: 'localhost/db'
// });
//
// // Or, shorthand:
// plugin('mongo', {
//   module: 'modella-mongo',
//   options: 'localhost/db'
// });
//
// // Or using the module name without options:
// plugin('modella-mongo');
//
// // Access the 'mongo' plugin:
// var mongo = plugin('mongo');
//```
//
function getOrCreatePlugin(name, options) {
  var app      = this;
  var defaults = app.utils.defaults;
  var is       = app.utils.is;

  if(!name) throw new Error('Missing model plugin name');

  var registered = is.string(name) && app._modelPlugins[name];

  // Plugin is registered
  // -> return the plugin
  if(registered && !options) {
    return app._modelPlugins[name];
  }

  // Plugin is registered and options were passed
  // -> invoke plugin with options and return
  if(registered && options) {
    return app._modelPlugins[name](options);
  }

  // Model isn't registered
  if(!registered) {

    // Set default options
    options = defaults({
      module: name
    }, options || {});

    // module is a string
    // -> require it
    if(is.string(options.module)) {
      options.module = app.requireFn(options.module);
    }

    // module isn't a Function
    // -> throw an Error
    if(!is.fn(options.module)) {
      throw new Error('Plugin invalid or not found: ' + name);
    }

    // module is a function and options were passed
    // -> invoke plugin with options
    else if(options.options) {
      options.module = options.module(options.options);
    }

    // Register the plugin
    app._modelPlugins[name] = options.module;

    // Return the plugin
    return app._modelPlugins[name];
  }
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
  var is            = app.utils.is;

  app._models       = {};
  app._modelPlugins = {};
  app.model         = getOrCreateModel.bind(app);
  app.model.plugin  = getOrCreatePlugin.bind(app);

  // Define common plugins
  var common = {
    'validation': {
      module: require('modella-validators')
    },
    'slug': {
      module: require('modella-slug')
    },
    'timestamps': {
      module: require('modella-timestamps')
    },
    'friendly-errors': {
      module: require('modella-friendly-errors')
    },
    'auth': {
      module: require('modella-auth')
    },
    'filter': {
      module: require('modella-filter')
    }
  };

  // Register common plugins
  Object.keys(common).forEach(function(name) {
    app.model.plugin(name, common[name]);
  });


  // Register user plugins
  if(options && options.plugins) {

    var plugs = options.plugins;

    if(is.array(plugs)) {
      plugs.forEach(function(plug) {
        app.model.plugin(plug);
      });
    }
    else if(is.object(plugs)) {
      Object.keys(plugs).forEach(function(name) {
        app.model.plugin(name, plugs[name]);
      });
    }

  }

  next();
};
