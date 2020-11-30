/*
 @VIDEO PLAYER EMBEDDABLE APP
 @ Author: Adeniyi Anthony
 @ email: mlisoftinc@gmail.com
 */
'use strict';

var VideoPlayer = {

    getPlayer: function getPlayer() {
        var playerDom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        //alert(loadCounter);
        var buildSourceFileFromUrl = function buildSourceFileFromUrl(fullUrl) {
            var delim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "?";

            //alert(fullUrl);
            if (!fullUrl || fullUrl == null || fullUrl == '') {
                return null;
            }
            // split using delimiter
            var fileArr = fullUrl.split(delim);
            if (!fileArr.length) {
                return null;
            }
            // src should be the last element in the array
            var src = fileArr[fileArr.length - 1];

            //alert(src);

            // check for appropriate source type
            var typeMp4 = /.mp4/;
            var typeOgg = /.ogg/;
            var typeAvi = /.avi/;

            var sourceType = "video/mp4"; // this is the default format

            if (typeMp4.test(src)) {
                sourceType = "video/mp4";
            } else if (typeOgg.test(src)) {
                sourceType = "video/ogg";
            } else if (typeAvi.test(src)) {
                sourceType = "video/avi";
            }

            var sourceHtml = '<source src=\'' + src + '\' type=\'' + sourceType + '\'/>';
            return sourceHtml;
        };

        var playerSourceFile = buildSourceFileFromUrl(window.location.toString());

        var html = '<video id="video-player-cont" controls preload="auto" style="width:100%; height:100%">\n            ' + playerSourceFile + '\n        </video>';

        //alert(html);
        // output player
        if (playerDom !== null) {
            var playerLayer = document.getElementById(playerDom);
            playerLayer.innerHTML = html;
        }
        loadCounter += 1;
        return html;
    },

    init: function init() {
        var playerDom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'video-player';

        window.addEventListener('load', function () {
            VideoPlayer.getPlayer(playerDom);
        });
    }
};

var loadCounter = 0;

VideoPlayer.init();