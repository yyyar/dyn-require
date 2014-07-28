### DynRequire

[![Build Status](https://travis-ci.org/yyyar/dyn-require.svg?branch=master)](https://travis-ci.org/yyyar/dyn-require) [![NPM version](https://badge.fury.io/js/dyn-require.svg)](http://badge.fury.io/js/dyn-require)

Dynamic loading Node.js modules from filesystem

#### Installation
```bash
$ npm install dyn-require
```

#### Usage

##### Sync work
```javascript
var DynRequire = require('dyn-require');

var modules = new DynRequre(__dirname + '/modules');

/* get all modules as array */
console.log( modules.requireAll() );

/* get all modules as object (relative path) -> (module) */
console.log( modules.requireAllEx() );

/* require module */
console.log( modules.require('modules/a') );

```

##### Async work
If using async method, DynRequire will emit two kind of messages: 'next' on next module loaded and 'done' when all modules are scanned and loaded.


```javascript
var DynRequire = require('dyn-require');

var modules = new DynRequre(__dirname + '/modules', {
    async: true
});

/* Next module */
modules.on('next', function(relPath, module) {
    console.log(relPath, module);
});

/* All modules */
modules.on('done', function(allModules, allModulesWithPaths) {
    console.log(allModules);

    // Here you can use 
    // modules.require and modules.requireAll, etc...
});
```

#### Author
* [Yaroslav Pogrebnyak](https://github.com/yyyar/)

#### License
MIT

