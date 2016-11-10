/**
 * test.js - simple test
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    DynRequire = require('../lib');

/* constants */

var EXPECTED_MODULES = ['a', 'child/a', 'another-child/c'];

/* module exports */

module.exports = {

    /**
     * Sync text
     */
    'sync': function(test) {

        var modules = new DynRequire(__dirname + '/modules', {
            async: false
        });

        test.ok(_.isEqual([], _.difference( _.keys(modules.requireAllEx()), EXPECTED_MODULES)), 'All modules are properly loaded');
        test.equal('child hello', modules.require('child/a' ), 'Can require child module');

        test.done();
    },

    /**
     * Astnc test
     */
    'async': function(test) {

        var modules = new DynRequire(__dirname + '/modules', {
            async: true
        });

        modules.on('next', function(relPath, m) {
            test.ok(m, relPath + ' module loaded');
            test.ok( _.includes(EXPECTED_MODULES, relPath), 'Loaded expected module ' + relPath );
        });

        modules.on('done', function(x) {
            test.ok(_.isEqual([], _.difference( _.keys(modules.requireAllEx()), EXPECTED_MODULES)), 'All modules are properly loaded');
            test.done();
        });
    },

    /**
     * Relative path
     */
    'relative path': function(test) {

        var modules = new DynRequire(__dirname + '/../tests/modules');

        test.ok(_.isEqual([], _.difference( _.keys(modules.requireAllEx()), EXPECTED_MODULES)), 'All modules are properly loaded');
        test.done();
    },
};

