function captureVideo() {
    var preview = document.querySelector('video#preview');
    var recording = document.querySelector('video#recording');
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        preview.srcObject = stream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
        return new Promise(function (resolve) {
            return preview.onplaying = resolve;
        });
    }).then(function () {
        var recorder = new MediaRecorder(preview.captureStream());
        var data = [];

        recorder.ondataavailable = function (event) {
            return data.push(event.data);
        };
        recorder.start();
        log(recorder.state + " for " + 60000 / 1000 + " seconds...");

        var stopped = new Promise(function (resolve, reject) {
            recorder.onstop = resolve;
            recorder.onerror = function (event) {
                return reject(event.name);
            };
        });

        $('button.stop').click(function () {
            recorder.stop();
        });

        return Promise.all([stopped]).then(function () {
            return data;
        });
    }).then(function (recordedChunks) {
        var recordedBlob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        recording.src = URL.createObjectURL(recordedBlob);
        $('#preview').hide();
        $('#recording').show();
        log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
        $('button.upload').click(function () {
            sendVideoToAPI(recordedBlob);
        });
    }).catch(log);
}
function sendVideoToAPI(blob) {

    var fd = new FormData();
    var file = new File([blob], 'recording');

    fd.append('data', file);
    console.log(fd); // test to see if appending form data would work, it didn't this is completely empty.


    var form = new FormData();
    var request = new XMLHttpRequest();
    form.append("file", file);
    request.open("POST", "/demo/upload", true);
    request.send(form); // hits the route but doesn't send the file
    console.log(request.response); // returns nothing

    // I have also tried this method which hits the route and gets a response however the file is not present in the request when it hits the server.
    // $.ajax({
    // 	url: Routing.generate('upload'),
    // 	data: file,
    // 	contentType: false,
    // 	processData: false,
    // 	error: function (res) {
    //     	console.log(res);
    // 	},
    // 	success: function(res) {
    //     	console.log(res);
    // 	}
    // });
}