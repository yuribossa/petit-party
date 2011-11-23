
var assert = require('assert')
  , mongoose = require('mongoose')
  , model = require('../lib/model')
  , constant = require('../lib/constant')
  , update = require('../lib/update');

var Room;
var roomId = 0;

function setUp() {
    var db = {};
    db.con = mongoose.createConnection('mongodb://localhost/test');
    db.Room = db.con.model('Room');
    db.con = update.setNewUpdate(db.con, db.Room);
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
    'New update $set success test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai1';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.update({id: room.id}, {$set: {name: 'tamai2'}}, {upsert: false}, function(err) {
                assert.isNull(err);
                db.Room.findOne({id: room.id}, function(err, doc) {
                    assert.isNull(err);
                    assert.isNotNull(doc);
                    assert.equal(doc.name, 'tamai2');
                    db.Room.remove({id: room.id}, function(err) {
                        assert.isNull(err);
                        tearDown(db);
                    });
                });
            });
        });
    }

    , 'New update $set error test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai1';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.update({id: room.id}, {$set: {name: createString(constant.ROOM_NAME_MAX_LENGTH+1)}}, {upsert: false}, function(err) {
                assert.isNotNull(err);
                db.Room.remove({id: room.id}, function(err) {
                    assert.isNull(err);
                    tearDown(db);
                });
            });
        });
    }

    , 'New update $push success test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai';
        room.comments = [];
        room.save(function(err) {
            assert.isNull(err);
            db.Room.update({id: room.id}, {$push: {comments: {comment: 'Hello!'}}}, {upsert: false}, function(err) {
                assert.isNull(err);
                db.Room.findOne({id: room.id}, function(err, doc) {
                    assert.isNull(err);
                    assert.isNotNull(doc);
                    assert.length(doc.comments, 1);
                    db.Room.remove({id: room.id}, function(err) {
                        assert.isNull(err);
                        tearDown(db);
                    });
                });
            });
        });
    }

    , 'New update $push error test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.update({id: room.id}, {$push: {comments: {comment: createString(constant.COMMENT_MAX_LENGTH+1)}}}, {upsert: false}, function(err) {
                assert.isNotNull(err);
                db.Room.remove({id: room.id}, function(err) {
                    assert.isNull(err);
                    tearDown(db);
                });
            });
        });
    }
};

