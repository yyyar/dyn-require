### DynRequire

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

