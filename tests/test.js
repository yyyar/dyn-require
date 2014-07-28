/**
 * test.js - simple test
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var DynRequire = require('../lib');

module.exports = {
    'sync': function(test) {

        var modules = new DynRequire(__dirname + '/modules', {
            async: false
        });

        console.log(modules.requireAllEx());
        console.log(modules.require('child/a'));
        test.done();
    },

    'async': function(test) {
        var modules = new DynRequire(__dirname + '/modules', {
            async: true
        });

        modules.on('next', function(a,b) {
            console.log("next", a,b);
        });

        modules.on('done', function(x) {
            console.log("done", x);
            test.done();
        });
    }
};

