
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
// mongodb
var mongoose = require('mongoose');
var room = require('./lib/model');
//

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// init mongodb
mongoose.connect('mongodb://localhost/petit-party');
var Room = mongoose.model('Room');
//

// Routes
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Petit Party'
        , youtube: false
    });
});

app.post('/join', function(req, res) {
    console.log(req.body.room);
    res.redirect('/room/' + req.body.room.id);
});

function parseISO8601(isodatetime) {
    　　　var newdate = isodatetime.replace(/^(\d{4})-(\d{2})-(\d{2})T([0-9:]*)([.0-9]*)(.)(.*)$/,'$1/$2/$3 $4 GMT');
    　　　newdate = Date.parse(newdate) + 1000*RegExp.$5;
    　　　var k = +1;
    　　　newdate -= k * Date.parse('1970/01/01 '+RegExp.$7+' GMT') * (RegExp.$6+'1');
    　　　return new Date(newdate);

}

app.post('/open', function(req, res) {
    console.log(req.body.room);
    var r = new Room();
    r.id = req.body.room.id;
    r.name = req.body.room.name;
    r.save(function(err) {
        Room.find({}, function(err, docs) {
            docs.forEach(function(doc) {
                console.log(doc.created);
                console.log(doc.created.toString());
            });
        });
        res.redirect('/room/' + req.body.room.id);
    });
});

app.get('/room/:id', function(req, res) {
    Room.findOne({id: req.params.id}, function(err, doc) {
        if (err || !doc) {
            res.redirect('home');
            return;
        }

        var count = doc.count++;
        

        var room = io
            .of('/room/' + req.params.id)
            .on('connection', function(socket) {
                console.log('Room ' + req.params.id + ' opened');

                socket.on('cue', function(data) {
                    console.log(data);
                    var options = {
                        host: 'www.youtube.com'
                        , port: 80
                        , path: '/watch?v=' + data.id
                    };
                    http.get(options, function(res) {
                        if (res.statusCode == 200) {
                            doc.videos.push({id: data.id});
                            doc.save(function(err) {
                                if (err) {
                                } else {
                                    socket.broadcast.emit('cue', {nextVideoId: data.id});
                                }
                            });
                        }
                    });
                });

                socket.on('comment', function(data) {
                    console.log(doc);
                    console.log(data);
                    doc.comments.push({comment: data.comment});
                    doc.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('bloadcast');
                            socket.broadcast.emit('comment', {comment: data});
                        }
                    });
                });

                socket.on('disconnect', function() {
                    console.log('Room ' + req.params.id + ' closed');
                });
            });

        res.render('room', {
            title: 'Petit Party'
            , roomId: req.params.id
            , youtube: true
        });
    });
});

app.get('/about', function(req, res) {
    res.render('about', {
        title: 'Petit Party'
        , youtube: false
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
