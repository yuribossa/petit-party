
/**
 * Comment model test
 */

var assert = require('assert')
  , mongoose = require('mongoose')
  , model = require('../lib/model')
  , update = require('../lib/update')
  , constant = require('../lib/constant');

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
    'Comment test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.findOne({id: room.id}, function(err, doc) {
                assert.isNull(err);
                assert.isNotNull(doc);
                assert.length(doc.comments, 0);
                console.log(1);
                db.Room.update({id: room.id}, {
                    $push: {comments: {comment: 'Hello Shiorin!'}}
                }, {}, function(err) {
                    console.log(2);
                    assert.isNull(err);
                    db.Room.findOne({id: room.id}, function(err, doc) {
                        assert.isNull(err);
                        console.log(doc);
                        assert.isNotNull(doc);
                        assert.length(doc.comments, 1);
                        db.Room.remove({id: room.id}, function(err) {
                            assert.isNull(err);
                            tearDown(db);
                        });
                    });
                });
            });
        });
    }

/*
    , 'Comment Room ID test': function() {
        var db = setUp();
        var room = new db.Room();
        db.Room.update({id: createUniqueId()}, {
            $push: {comments: {comment: 'Hello Shiorin!'}}
        }, {}, function(err) {
            console.log(err);
            assert.isNotNull(err);
            tearDown(db);
            console.log('end');
        });
    }
    */
};

