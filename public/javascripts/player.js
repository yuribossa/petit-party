/**
 * player.js
 */

/**
 * YouTube
 */
// YouTube player settings
var params = {allowScriptAccess: 'always'};
swfobject.embedSWF('http://www.youtube.com/v/qwD4l8Oyckg?enablejsapi=1&playerapiid=ytplayer', 'ytplayer', '440', '270', '8', null, null, params, null);

function onYouTubePlayerReady(playerId) {
        ytplayer = document.getElementById('ytplayer');
        ytplayer.addEventListener('onStateChange', 'onytplayerStateChange');
        ytplayer.playVideo();
}

// Queue
var videoQueue = [];

// YouTube player state change function
var flg = 0;
function onytplayerStateChange(newState) {
    switch (newState) {
        // Video finish
        case 0:
            if (videoQueue.length) {
                var id = videoQueue.shift();
                ytplayer.loadVideoById(id, 0);
            }
            break;
    }
}

/**
 * WebSocket
 */
var socket = io.connect(document.location.href);

// Message show time
var showTime = 3000;

// Receive comment
socket.on('comment', function(data) {
    if (!data.comment) {
        $('.error').text('Comment is not accepted.');
        setTimeout(function() {
            $('.error').text('');
        }, showTime);
    } else {
        addComment(data.comment);
    }
});

// Receive cue
socket.on('cue', function(data) {
    if (!data.id) {
        $('.error').text('Cue is not accepted.');
        setTimeout(function() {
            $('.error').text('');
        }, showTime);
    } else {
        var state = ytplayer.getPlayerState();
        if (state == -1 || state == 0) {
            ytplayer.loadVideoById(data.id, 0);
        } else {
            $('.message').text('Next video is ready.');
            setTimeout(function() {
                $('.message').text('');
            }, showTime);
            videoQueue.push(data.id);
        }
    }
});

// Send cue
function cue() {
    var nextVideoId = $('#nextVideoId').val();
    $('#nextVideoId').val('');
    socket.emit('cue', {id: nextVideoId});
}

// Send comment
function postComment() {
    var msg = $('#comment').val();
    $('#comment').val('');
    socket.emit('comment', {comment: msg});
}

// Create comment DOM
function addComment(comment) {
}

