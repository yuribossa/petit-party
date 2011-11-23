/**
 * player.js
 */

var params = {allowScriptAccess: 'always'};
swfobject.embedSWF('http://www.youtube.com/v/qwD4l8Oyckg?enablejsapi=1&playerapiid=ytplayer', 'ytplayer', '425', '356', '8', null, null, params, null);

function onYouTubePlayerReady(playerId) {
        ytplayer = document.getElementById('ytplayer');
        //ytplayer.addEventListener('onStateChange', 'onytplayerStateChange');
        //ytplayer.playVideo();
}

var flg = 0;
function onytplayerStateChange(newState) {
    switch (newState) {
        case 0:
            if (flg % 2 == 0) {
                ytplayer.loadVideoById('048nW5x6eqg', 0);
            } else {
                ytplayer.loadVideoById('Y21dw_wWHMM', 0);
            }
            flg++;
            break;
    }
}

console.log(document.location);
var socket = io.connect(document.location.href);

socket.on('comment', function(data) {
    console.log('recieved: ' + data);
});

function cue() {
    var nextVideoId = document.getElementById('nextVideoId').value;
    console.log(nextVideoId);
}

function postComment() {
    var msg = document.getElementById('comment').value;
    console.log('send: ' + msg);
    socket.emit('comment', {comment: msg});
}

