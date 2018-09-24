/**
 * upload a image and save as dataURL using canvas controller
 */
function upload_iamge(){
    $("#comment_image").on("change", function(e) {
        var file = e.target.files[0];
        if (!file.type.match('image.*')) {
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            var newimg=new Image();
            newimg.src = e.target.result;
            newimg.onload = function () {
                var maxWidth = 800;
                var maxHeight = 800;
                var imageWidth = newimg.width;
                var imageHeight = newimg.height;

                var canvas = document.getElementById('show_image');
                canvas.width=imageWidth;
                canvas.height=imageHeight;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(newimg,0,0);
                canvas.strDataURI = canvas.toDataURL();
            }

        }
    });
}


var mediaStreamTrack = null;

/**
 * open camera and initialize some settings
 */
function opencemera(){
    if (mediaStreamTrack==null){
        var video = document.getElementById('videoplay');
        var localMediaStream = null;
        var errorCallback = function(e) {
            alert('Rejected!', e);
        };
        var hdConstraints = {
            video: {
                mandatory: {
                    minWidth: 300,
                    minHeight: 300
                }
            }
        };
        video.addEventListener('click', snapshot, false);
        navigator.getUserMedia(hdConstraints, function(stream) {
            video.width = 300;
            video.height = 300;
            video.src = window.URL.createObjectURL(stream);
            localMediaStream = stream;
            mediaStreamTrack = stream;
        }, errorCallback);

        var videodiv = document.getElementById("videodiv");
        var closebutton = document.createElement('div');
        closebutton.className = 'w3-red w3-button';
        closebutton.onclick = closecamera;
        closebutton.innerText = 'close camera';
        closebutton.id = "closebutton";
        videodiv.appendChild(closebutton);

        function snapshot() {
            if (localMediaStream) {
                var canvas = document.getElementById('show_image');
                canvas.width=300;
                canvas.height=300;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0,300,300);
                canvas.strDataURI = canvas.toDataURL();
            }
        }
    }

};

/**
 * close the camera by setting width and height as 0
 */
function closecamera(){
    if (mediaStreamTrack !=null){
        mediaStreamTrack.getTracks().forEach(function (track) {
            track.stop();
        });
        var video = document.getElementById('videoplay');
        video.width = 0;
        video.height = 0;
        mediaStreamTrack = null;
    }
    var videodiv = document.getElementById("videodiv");
    var closebutton = document.getElementById('closebutton');
    videodiv.removeChild(closebutton);
}
