
var assert = require('assert')
  , server = require('../server');

module.exports = {
    'first test': function() {
        assert.equal(49, 7*7);
    },

    'server first test': function() {
        assert.response(server,
            {
                url: '/',
            },
            {status: 200},
            function(res) {
                assert.includes(res.body, '<title>yuribossa</title>');
            }
        );
    }
};

