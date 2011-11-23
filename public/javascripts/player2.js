/**
 * player.js
 */

var params = {allowScriptAccess: 'always'};
var atts1 = {id: 'myytplayer1'};
swfobject.embedSWF('http://www.youtube.com/v/qwD4l8Oyckg?enablejsapi=1&playerapiid=ytplayer1', 'player1', '425', '356', '8', null, null, params, null);
var atts2 = {id: 'myytplayer2'};
swfobject.embedSWF('http://www.youtube.com/v/X_ADWHYN94Y?enablejsapi=1&playerapiid=ytplayer2', 'player2', '425', '356', '8', null, null, params, null);
//swfobject.embedSWF('http://www.youtube.com/v/X_ADWHYN94Y?enablejsapi=1&playerapiid=ytplayer2', 'ytapiplayer2', '425', '356', '8', null, null, params, atts2);

function onYouTubePlayerReady(playerId) {
    console.log(playerId);
    if (playerId == 'ytplayer1') {
        ytplayer1 = document.getElementById('player1');
        ytplayer1.addEventListener('onStateChange', 'onytplayerStateChange1');
        ytplayer1.playVideo();
    } else {
        ytplayer2 = document.getElementById('player2');
        ytplayer2.addEventListener('onStateChange', 'onytplayerStateChange2');
        ytplayer2.hide();
    }
}

function onytplayerStateChange1(newState) {
    switch (newState) {
        case 0:
            ytplayer2.playVideo();
            break;
    }
}

function onytplayerStateChange2(newState) {
    switch (newState) {
        case 0:
            ytplayer1.playVideo();
            break;
    }
}
