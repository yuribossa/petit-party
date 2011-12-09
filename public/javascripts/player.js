/**
 * player.js
 * YouTube and WebSocket
 */

/**
 * WebSocket
 */
var socket = io.connect(document.location.href);

/**
 * YouTube
 */
// YouTube player settings
var params = {allowScriptAccess: 'always'};
swfobject.embedSWF('http://www.youtube.com/v/qwD4l8Oyckg?enablejsapi=1&playerapiid=ytplayer', 'ytplayer', '440', '270', '8', null, null, params, null);

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById('ytplayer');
    ytplayer.addEventListener('onStateChange', 'onytplayerStateChange');
    // First send message
    socket.emit('join', {});
}

var currentVideoId = '';

// YouTube player state change function
function onytplayerStateChange(newState) {
    switch (newState) {
        // Video finish
        case 0:
            socket.emit('signal', {
                stat: 'end'
                , videoId: currentVideoId
            });
            currentVideoId = '';
            break;
    }
}

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
    if (!data.res) {
        $('.error').text('Cue is not accepted.');
        setTimeout(function() {
            $('.error').text('');
        }, showTime);
    } else {
        $('.message').text('Next video is ready.');
    }
});

// Receive signal
socket.on('signal', function(data) {
    switch (data.stat) {
        case 'play':
            ytplayer.loadVideoById(data.videoId, data.start);
            currentVideoId = data.videoId;
            $('.message').text('');
            break;
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
    $(".comment:hidden").clone().prependTo("#timeline").show();
    $("#timeline > .comment:first > p").text(comment);
    var text = $("#timeline > .comment:first > p").html();
    text = text.replace(/(\r\n)|\r|\n/g, "<br/>");
    $("#timeline > .comment:first > p").text("").html(text);
}

