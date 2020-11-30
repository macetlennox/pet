var Conference = {

    muteUserAudio: function muteUserAudio(_this, userId) {
        var userButtonId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var audioOn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'mute-icon-on';
        var audioOff = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'mute-icon-off';

        var buttonClass = document.getElementById(userButtonId).getAttribute("class");
        var msg = null;
        if (buttonClass.indexOf(audioOn) !== -1) {
            _this.sendToAllInConference(null, 'mute-audio', true, userId);
            msg = "Muting, please wait ";
        } else {
            _this.sendToAllInConference(null, 'unmute-audio', true, userId);
            msg = "Enabling audio, please wait ";
        }
        PopUp.setMessage(_this, React.createElement(
            'div',
            { className: 'alert alert-info' },
            msg
        ), 1000);
    },

    expandView: function expandView(_this, userId, conferenceVideoId, mainPreview) {
        var mainVideo = document.getElementById(mainPreview);
        var userVideo = document.getElementById(conferenceVideoId);
        var fps = 0;
        // before we capture the stream, we must ensure the mainVideo width and height
        // matches with the userVideo width and height

        var stream = userVideo.mozCaptureStream ? userVideo.mozCaptureStream(fps) : userVideo.captureStream(fps);
        console.log(userVideo.videoWidth, "user video width");
        console.log(userVideo.videoHeigth, "user video height");
        mainVideo.srcObject = stream;
        mainVideo.play();
    },

    expandViewOld: function expandViewOld(_this, userId, conferenceVideoId, mainPreview) {
        var mainVideo = document.getElementById(mainPreview);
        var userVideo = document.getElementById(conferenceVideoId);
        mainVideo.srcObject.getVideoTracks().map(function (device) {
            // remove the video
            if (device.kind === "video") mainVideo.srcObject.removeTrack(device);
        });
        userVideo.srcObject.getVideoTracks().map(function (device) {
            if (device.kind === "video") mainVideo.srcObject.addTrack(device);
        });
    },

    sendPrivateFile: function sendPrivateFile(_this, userId) {},

    leaveSession: function leaveSession(_this, userId) {
        var redirectUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "login.php";

        var del = confirm(_this.state.confirmDeleteMsg);
        if (del == false) {
            return null;
        }
        _this.deleteUserFromMeeting(null, null, redirectUrl);
        // notify all users
        _this.sendToAllInConference(null, 'leave', true, userId);
    },

    kickOutUser: function kickOutUser(_this, userId, user) {
        var msg = 'Evict ' + user + ', ' + _this.state.confirmDeleteMsg.toLocaleLowerCase();
        var del = confirm(msg);
        if (del == false) {
            return null;
        }
        _this.deleteUserFromMeeting(userId, user);
        // once user is kicked out, send websocket notification
        _this.sendToAllInConference(null, 'evicted', true, userId);
    },

    makeUserPresenter: function makeUserPresenter(_this, userId, user) {
        var conferencePresenterButtonId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var on = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "-on";
        var off = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "-off";


        var buttonClass = document.getElementById(conferencePresenterButtonId).getAttribute("class");
        var msg = null;
        if (buttonClass.indexOf(off) !== -1) {
            _this.sendToAllInConference(null, 'set-presenter', true, userId);
            msg = 'Making ' + user + ' a presenter';
        } else {
            _this.sendToAllInConference(null, 'unset-presenter', true, userId);
            msg = 'Making ' + user + ' a viewer';
        }
        PopUp.setMessage(_this, React.createElement(
            'div',
            { className: 'alert alert-info' },
            msg
        ), 1000);
    }
};