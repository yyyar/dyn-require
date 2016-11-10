/**
 * index.js - DynRequire
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    path = require('path'),
    fsextra = require('fs-extra'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


/* DynRequire constructor */
var DynRequire = function(base, options) {

    // Base scanning path
    var basePath = this.basePath = path.normalize(base);

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
        return _.chain(files).filter(function(f) { return _.includes(['.js', '.json'], path.extname(f)); })
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

    /* ----- Do sync or async processing ----- */

    if (!this.options.async) {
        return collect(process(fsextra.walkSync(basePath)));
    }


    // Files for async processing
    var files = [];

    fsextra.walk(basePath).on('data', function(item) {
        files.push(item.path);
    })
    .on('end', function() {
        collect(process(files));
    })
    .on('error', function(err) {
        console.log(err);
    });
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


