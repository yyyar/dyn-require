/**
 * index.js - DynRequire
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    path = require('path'),
    wrench = require('wrench'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


/* DynRequire constructor */
var DynRequire = function(basePath, options) {

    // Base scanning path
    this.basePath = basePath;

    // Options
    this.options = _.merge({
        except: [], // todo
        include: [], // todo
        recoursive: true, // todo
        async: false
    }, options);

    // Scanned and loaded modules
    this.modules = {};

    var self = this;

    /**
     * Process filtering
     */
    var process = function(files) {
        return _.chain(files).filter(function(f) { return path.extname(f) == '.js'; })
                     .map(function(f) { return path.join(basePath, f); })
                     .filter(function(f) { return f != basePath;  })
                     .value();
    };

    /**
     * Collect modules
     */
    var collect = function(files) {

         _.each(files, function(f) {
             var relative = f.substring(basePath.length + 1);
             relative = relative.replace(/\.(.*?)$/, '');
             self.modules[relative] = require(f);
             self.emit('next', relative, self.modules[relative]);
        });

        self.emit('done', self.modules, _.values(self.modules));
    };


    // Files for processing
    var files = [];

    /* Do sync or async processing */
    if (!this.options.async) {
        files = process(wrench.readdirSyncRecursive(basePath));
        collect(files);
    } else {
        wrench.readdirRecursive(basePath, function(err, fils) {
            if (fils === null) {
                return collect(files);
            }
            files = files.concat( process(fils));
        });
    }
};


/* Inherit event emitter */

util.inherits(DynRequire, EventEmitter);


/* Methods */

/**
 * Require module by relative path
 */
DynRequire.prototype.require = function(name) {
    return this.modules[name];
};

/**
 * Require all scanned modules and return list of them
 */
DynRequire.prototype.requireAll = function() {
    return _.values(this.modules);
};

/**
 * Require all modules and return object
 * (relativePath) -> (module)
 */
DynRequire.prototype.requireAllEx = function() {
    return this.modules;
};


/* module exports */

module.exports = DynRequire;


