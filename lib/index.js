/**
 * index.js - DynRequire
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var path = require('path'),
    wrench = require('wrench'),
    _ = require('lodash'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var DynRequire = function(basePath, options) {

    this.basePath = basePath;

    this.options = _.merge({
        except: [],
        include: [],
        recoursive: true,
        async: false
    }, options);

    this.modules = {};

    var self = this;

    var process = function(files) {
        return _.chain(files).filter(function(f) { return path.extname(f) == '.js'; })
                     .map(function(f) { return path.join(basePath, f); })
                     .filter(function(f) { return f != basePath;  })
                     .value();
    };

    var collect = function(files) {
         _.each(files, function(f) {
             var relative = f.substring(basePath.length + 1);
             relative = relative.replace(/\.(.*?)$/, '');
             self.modules[relative] = require(f);
             self.emit('next', relative, self.modules[relative]);
        });

        self.emit('done', self.modules, _.values(self.modules));
    };


        var files = [];

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

util.inherits(DynRequire, EventEmitter);

DynRequire.prototype.require = function(name) {
    return this.modules[name];
};

DynRequire.prototype.requireAll = function() {
    return _.values(this.modules);
};

DynRequire.prototype.requireAllEx = function() {
    return this.modules;
};


/* module exports */
module.exports = DynRequire;


