
/**
 * Room model test
 */

var assert = require('assert')
  , mongoose = require('mongoose')
  , model = require('../lib/model')
  , constant = require('../lib/constant');

var Room;
var roomId = 0;

function setUp() {
    var db = {};
    db.con = mongoose.createConnection('mongodb://localhost/test');
    db.Room = db.con.model('Room');
    return db;
}

function tearDown(db) {
    db.con.close();
}

function createUniqueId() {
    return 'tamai' + roomId++;
}

function createString(len) {
    var str = '';
    for (var i=0; i<len; i++) str += 'a';
    return str;
}

module.exports = {
    'Room test 1': function() {
        var db = setUp();
        var room = new db.Room();
        assert.isNotNull(room);
        tearDown(db);
    }

    , 'Room ID test 1': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = '';
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room ID test 2': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createString(constant.ROOM_ID_MIN_LENGTH - 1);
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room ID test 3': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createString(constant.ROOM_ID_MIN_LENGTH);
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.remove({id: room.id}, function(err) {
                assert.isNull(err);
                tearDown(db);
            });
        });
    }

    , 'Room ID test 4': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createString(constant.ROOM_ID_MAX_LENGTH);
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.remove({id: room.id}, function(err) {
                assert.isNull(err);
                tearDown(db);
            });
        });
    }

    , 'Room ID test 5': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createString(constant.ROOM_ID_MAX_LENGTH + 1);
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room ID test 6': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = 'a-_Z0';
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.remove({id: room.id}, function(err) {
                assert.isNull(err);
                tearDown(db);
            });
        });
    }

    , 'Room ID test 7': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = 'tamai@shiori';
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room ID test 8': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = 'あいうえお';
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room ID unique test': function() {
        if (!constant.ROOM_ID_UNIQUE_FLG) {
            assert.ok(true);
            return;
        }
        var db = setUp();
        var room1 = new db.Room();
        room1.id = createUniqueId();
        room1.name = 'tamai1';
        room1.save(function(err) {
            assert.isNull(err);
            var room2 = new db.Room();
            room2.id = 'tamai1';
            room2.name = 'tamai2';
            room2.save(function(err) {
                assert.isNotNull(err);
                db.Room.remove({id: room1.id}, function(err) {
                    assert.isNull(err);
                    tearDown(db);
                });
            });
        });
    }

    , 'Room Name test 1': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = '';
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room Name test 2': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = createString(constant.ROOM_NAME_MIN_LENGTH - 1);
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }

    , 'Room Name test 3': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = createString(constant.ROOM_NAME_MIN_LENGTH);
        room.save(function(err) {
            assert.isNull(err);
            db.Room.remove({id: room.id}, function(err) {
                assert.isNull(err);
                tearDown(db);
            });
        });
    }

    , 'Room Name test 4': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = createString(constant.ROOM_NAME_MAX_LENGTH);
        room.save(function(err) {
            assert.isNull(err);
            db.Room.remove({id: room.id}, function(err) {
                assert.isNull(err);
                tearDown(db);
            });
        });
    }

    , 'Room Name test 5': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = createString(constant.ROOM_NAME_MAX_LENGTH + 1);
        room.save(function(err) {
            assert.isNotNull(err);
            tearDown(db);
        });
    }
};

