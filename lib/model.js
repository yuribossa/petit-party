/**
 * model.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant');

var Video = new Schema({
    id: {
        type: String
        , required: true
    }
    , start: {
        type: Number
        , default: 0
        , min: 0
    }
    , created: {
        type: Date
        , default: Date.now
    }
});

var Comment = new Schema({
    comment: {
        type: String
        , required: true
        , validate: [function(v) {
            return v.length >= constant.COMMENT_MIN_LENGTH && v.length <= constant.COMMENT_MAX_LENGTH;
        }, 'Invalid Comment']
    }
    , created: {
        type: Date
        , default: Date.now
    }
});

var Room = new Schema({
    id: {
        type: String
        , required: true
        //, unique: constant.ROOM_ID_UNIQUE_FLG
        , validate: [function(v) {
            var re = new RegExp('^[a-zA-Z0-9_-]{' + constant.ROOM_ID_MIN_LENGTH + ',' + constant.ROOM_ID_MAX_LENGTH + '}$');
            return re.test(v);
        }, 'Invalid Room ID']
    }
    , name: {
        type: String
        , required: true
        , validate: [function(v) {
            return v.length >= constant.ROOM_NAME_MIN_LENGTH && v.length <= constant.ROOM_NAME_MAX_LENGTH;
        }, 'Invalid Room Name']
    }
    , videos: [Video]
    , comments: [Comment]
    , created: {
        type: Date
        , default: Date.now
    }
});

mongoose.model('Room', Room);

