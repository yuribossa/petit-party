
/**
 * HTTP response test
 */

var assert = require('assert')
  , server = require('../server')
  , mongoose = require('mongoose');

module.exports = {
    'Index response test': function() {
        assert.response(server,
            {
                url: '/',
            },
            {status: 200},
            function(res) {
                assert.includes(res.body, '<title>Petit Party</title>');
                assert.includes(res.body, 'Join Room');
                assert.includes(res.body, 'Open New Room');
                mongoose.disconnect();
            }
        );
    }

    , 'About response test': function() {
        assert.response(server,
            {
                url: '/about',
            },
            {status: 200},
            function(res) {
                assert.includes(res.body, '<title>About - Petit Party</title>');
                assert.includes(res.body, "Let's enjoy party using YouTube!");
                mongoose.disconnect();
            }
        );
    }
};


