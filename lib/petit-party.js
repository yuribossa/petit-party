
/**
 * Module dependencies.
 */

var http = require('http');
var constant = require('./constant');

// mongodb
var mongoose = require('mongoose');
var room = require('./model');
var update = require('./update');
//

// variable of Room connection exists
var roomConnections = {};

exports.boot = function(app) {
    bootApplication(app);
};

// boot application
function bootApplication(app) {
    var io = require('socket.io').listen(app);

    // Init mongodb
    var conn = mongoose.createConnection('mongodb://localhost/petit-party');
    var Room = conn.model('Room');
    conn = update.setNewUpdate(conn, Room);
    //

    /**
     * Index
     * url /
     */
    app.get(constant.PETIT_PARTY_PREFIX + '/', function(req, res) {
        res.render('index', {
            title: 'Petit Party'
            , message: ''
            , youtube: false
        });
    });

    /**
     * Join room
     * url /join
     */
    app.post(constant.PETIT_PARTY_PREFIX + '/join', function(req, res) {
        res.redirect(constant.PETIT_PARTY_PREFIX + '/room/' + req.body.room.id);
    });

    /**
     * Open new room
     * url /open
     */
    app.post(constant.PETIT_PARTY_PREFIX + '/open', function(req, res) {
        var r = new Room();
        r.id = req.body.room.id;
        r.name = req.body.room.name;
        Room.findOne({id: r.id}, function(err, doc) {
            if (err) {
                res.render('index', {
                    title: 'Petit Party'
                    , message: 'Something Error'
                    , youtube: false
                });
                return;
            }

            if (doc) {
                res.render('index', {
                    title: 'Petit Party'
                    , message: r.id + ' is already exists.'
                    , youtube: false
                });
                return;
            }

            r.save(function(err) {
                if (err) {
                    res.render('index', {
                        title: 'Petit Party'
                        , message: 'Something Error'
                        , youtube: false
                    });
                    return;
                }

                res.redirect(constant.PETIT_PARTY_PREFIX + '/room/' + req.body.room.id);
            });
        });
        /**
         * If unique is true
        r.save(function(err) {
            Room.find({}, function(err, docs) {
                docs.forEach(function(doc) {
                    console.log(doc.created);
                    console.log(doc.created.toString());
                });
            });
            res.redirect(constant.PETIT_PARTY_PREFIX + '/room/' + req.body.room.id);
        });
        */
    });

    /**
     * Party room
     * url /room/:id
     */
    app.get(constant.PETIT_PARTY_PREFIX + '/room/:id', function(req, res) {
        var roomId = req.params.id;
        Room.findOne({id: roomId}, function(err, doc) {
            if (err || !doc) {
                res.redirect(constant.PETIT_PARTY_PREFIX + '/');
                return;
            }

            if (!roomConnections[roomId]) {
                // Create connection
                roomConnections[roomId] = true;
                var room = io
                    .of(constant.PETIT_PARTY_PREFIX + '/room/' + roomId)
                    .on('connection', function(socket) {
                        console.log('Room ' + roomId + ' opened');

                        /**
                         * Cue video
                         */
                        socket.on('cue', function(data) {
                            var videoId = data.id;
                            var options = {
                                host: 'www.youtube.com'
                                , port: 80
                                , path: '/watch?v=' + videoId
                            };
                            http.get(options, function(res) {
                                if (res.statusCode != 200) {
                                    socket.emit('cue', {id: false});
                                } else {
                                    Room.update({id: roomId}, {$push: {videos: {id: videoId}}}, {}, function(err) {
                                        if (err) {
                                            socket.emit('cue', {id: false});
                                        } else {
                                            socket.emit('cue', {id: videoId});
                                            socket.broadcast.emit('cue', {id: videoId});
                                        }
                                    });
                                }
                            });
                        });

                        /**
                         * Comment
                         */
                        socket.on('comment', function(data) {
                            Room.update({id: roomId}, {$push: {comments: {comment: data.comment}}}, {}, function(err) {
                                if (err) {
                                    socket.emit('comment', {comment: false});
                                } else {
                                    socket.emit('comment', {comment: data.comment});
                                    socket.broadcast('comment', {comment: data.comment});
                                }
                            });
                        });

                        /**
                         * Disconnect
                         */
                        socket.on('disconnect', function() {
                            console.log('Room ' + req.params.id + ' closed');
                        });
                    });
            }

            res.render('room', {
                title: doc.name + ' - Petit Party'
                , roomName: doc.name
                , youtube: true
            });
        });
    });

    /**
     * About page
     * url /about
     */
    app.get('/about', function(req, res) {
        res.render('about', {
            title: 'About - Petit Party'
            , youtube: false
        });
    });

}

