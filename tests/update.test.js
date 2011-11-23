
var assert = require('assert')
  , mongoose = require('mongoose')
  , model = require('../lib/model')
  , constant = require('../lib/constant');

var Room;
var roomId = 0;

function setUp() {
    var db = {};
    db.con = mongoose.createConnection('mongodb://localhost/test');
    db.con.base.Model.newUpdate = function(conditions, update, options, callback) {
        db.Room.find(conditions, function(err, docs) {
            docs.forEach(function(doc) {
                for (var ope in update) {
                    switch (ope) {
                        case '$set':
                            for (var key in update['$set']) {
                                doc[key] = update['$set'][key];
                            }
                            doc.save(function(err) {
                                callback(err);
                            });
                            break;
                        case '$push':
                            for (var key in update['$push']) {
                                doc[key].push(update['$push'][key]);
                            }
                            doc.save(function(err) {
                                callback(err);
                            });
                            break;
                    }
                }
            });
        });
    };
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
    'Original update test 1': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai1';
        room.save(function(err) {
            assert.isNull(err);
            // expect invalid error
            db.Room.update({id: room.id}, {$set: {name: ''}}, {upsert: false}, function(err) {
                // but err is null
                assert.isNull(err);
                db.Room.findOne({id: room.id}, function(err, doc) {
                    // doc.name is updated ''
                    assert.isNull(err);
                    assert.isNotNull(doc);
                    assert.equal(doc.name, '');
                    db.Room.remove({id: room.id}, function(err) {
                        assert.isNull(err);
                        tearDown(db);
                    });
                });
            });
        });
    }

    , 'New update $set success test': function() {
        var db = setUp();
        var room = new db.Room();
        room.id = createUniqueId();
        room.name = 'tamai1';
        room.save(function(err) {
            assert.isNull(err);
            db.Room.newUpdate({id: room.id}, {$set: {name: 'tamai2'}}, {upsert: false}, function(err) {
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
            db.Room.newUpdate({id: room.id}, {$set: {name: createString(constant.ROOM_NAME_MAX_LENGTH+1)}}, {upsert: false}, function(err) {
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
            db.Room.newUpdate({id: room.id}, {$push: {comments: {comment: 'Hello!'}}}, {upsert: false}, function(err) {
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
            db.Room.newUpdate({id: room.id}, {$push: {comments: {comment: createString(constant.COMMENT_MAX_LENGTH+1)}}}, {upsert: false}, function(err) {
                assert.isNotNull(err);
                db.Room.remove({id: room.id}, function(err) {
                    assert.isNull(err);
                    tearDown(db);
                });
            });
        });
    }
};

