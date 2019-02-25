/*

>> kasperkamperman.com - 2018-04-18
>> https://www.kasperkamperman.com/blog/camera-template/

*/

/*import * as posenet from '@tensorflow-models/posenet';
import dat from 'dat.gui';
import Stats from 'stats.js';

import {drawBoundingBox, drawKeypoints, drawSkeleton} from './demo_util';*/


var takeSnapshotUI = createClickFeedbackUI();

var takePhotoButton;
var toggleFullScreenButton;
var switchCameraButton;
var amountOfCameras = 0;
var currentFacingMode = 'environment';
var cameraSensor;
var cameraOutput;
var video;






				

document.addEventListener("DOMContentLoaded", function(event) {

    // do some WebRTC checks before creating the interface
    DetectRTC.load(function() {

        // do some checks
        if (DetectRTC.isWebRTCSupported == false) {
            alert('Please use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher');
        }
        else {
            if (DetectRTC.hasWebcam == false) {
                alert('Please install an external webcam device.');
            }
            else {

                amountOfCameras = DetectRTC.videoInputDevices.length;
                       
                initCameraUI();
                initCameraStream();
                //drawloop();
            } 
        }
        
        console.log("RTC Debug info: " + 
            "\n OS:                   " + DetectRTC.osName + " " + DetectRTC.osVersion + 
            "\n browser:              " + DetectRTC.browser.fullVersion + " " + DetectRTC.browser.name +
            "\n is Mobile Device:     " + DetectRTC.isMobileDevice +
            "\n has webcam:           " + DetectRTC.hasWebcam + 
            "\n has permission:       " + DetectRTC.isWebsiteHasWebcamPermission +       
            "\n getUserMedia Support: " + DetectRTC.isGetUserMediaSupported + 
            "\n isWebRTC Supported:   " + DetectRTC.isWebRTCSupported + 
            "\n WebAudio Supported:   " + DetectRTC.isAudioContextSupported +
            "\n is Mobile Device:     " + DetectRTC.isMobileDevice
        );

    });

});


function initCameraUI() {
    
    video = document.getElementById('video');
    var videoWidth = video.width;
    var videoHeight = video.height;
    //net = await posenet.load(0.75);

    //takePhotoButton = document.getElementById('takePhotoButton');
    toggleFullScreenButton = document.getElementById('toggleFullScreenButton');
    switchCameraButton = document.getElementById('switchCameraButton');
    cameraSensor = document.getElementById('camerasensor');
    cameraOutput = document.getElementById('cameraoutput');

    //detectPoseInRealTime(video, net);

    
    //drawloop();
    
    // https://developer.mozilla.org/nl/docs/Web/HTML/Element/button
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role

    /*takePhotoButton.addEventListener("click", function() {
        //takeSnapshotUI();
        takeSnapshot();        
    });*/

    // -- fullscreen part

    function fullScreenChange() {
        if(screenfull.isFullscreen) {
            toggleFullScreenButton.setAttribute("aria-pressed", true);
        }
        else {
            toggleFullScreenButton.setAttribute("aria-pressed", false);
        }
    }

    if (screenfull.enabled) {
        screenfull.on('change', fullScreenChange);

        toggleFullScreenButton.style.display = 'block';  

        // set init values
        fullScreenChange();

        toggleFullScreenButton.addEventListener("click", function() {
            screenfull.toggle(document.getElementById('container'));
        });
    }
    else {
        console.log("iOS doesn't support fullscreen (yet)");   
    }
        
    // -- switch camera part
    if(amountOfCameras > 1) {
        
        switchCameraButton.style.display = 'block';
        
        switchCameraButton.addEventListener("click", function() {

            if(currentFacingMode === 'environment') currentFacingMode = 'user';
            else                                    currentFacingMode = 'environment';

            initCameraStream();

        });  
    }

    // Listen for orientation changes to make sure buttons stay at the side of the 
    // physical (and virtual) buttons (opposite of camera) most of the layout change is done by CSS media queries
    // https://www.sitepoint.com/introducing-screen-orientation-api/
    // https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
    window.addEventListener("orientationchange", function() {
        
        // iOS doesn't have screen.orientation, so fallback to window.orientation.
        // screen.orientation will 
        if(screen.orientation) angle = screen.orientation.angle;
        else                   angle = window.orientation;

        var guiControls = document.getElementById("gui_controls").classList;
        var vidContainer = document.getElementById("vid_container").classList;

        if(angle == 270 || angle == -90) {
            guiControls.add('left');
            vidContainer.add('left');
        }
        else {
            if ( guiControls.contains('left') ) guiControls.remove('left');
            if ( vidContainer.contains('left') ) vidContainer.remove('left');
        }

        //0   portrait-primary   
        //180 portrait-secondary device is down under
        //90  landscape-primary  buttons at the right
        //270 landscape-secondary buttons at the left
    }, false);
    
}

// https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js
function initCameraStream() {

    // stop any active streams in the window
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }

    var constraints = { 
        audio: false, 
        video: {
            //width: { min: 1024, ideal: window.innerWidth, max: 1920 },
            //height: { min: 776, ideal: window.innerHeight, max: 1080 },
            facingMode: currentFacingMode
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);   

    function handleSuccess(stream) {

        window.stream = stream; // make stream available to browser console
        video.srcObject = stream;

        if(constraints.video.facingMode) {

            if(constraints.video.facingMode === 'environment') {
                switchCameraButton.setAttribute("aria-pressed", true);
            }
            else {
                switchCameraButton.setAttribute("aria-pressed", false);
            }
        }

        return navigator.mediaDevices.enumerateDevices();
    }

    function handleError(error) {

        console.log(error);

        //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        if(error === 'PermissionDeniedError') {
            alert("Permission denied. Please refresh and give permission.");
        }
        
    }

}

/*function drawLoop() {
    var canvas = document.createElement('canvas');

    var width = video.videoWidth;
    var height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    requestAnimationFrame(drawLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    ctracker.draw(canvas);
}*/

function takeSnapshot() {
    
    // if you'd like to show the canvas add it to the DOM

    /*cameraSensor.width = video.videoWidth;
    cameraSensor.height = video.videoHeight;
    cameraSensor.getContext("2d").drawImage(video, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");*/

       
    var canvas = document.createElement('canvas');

    var width = video.videoWidth;
    var height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    cameraOutput.src = canvas.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    

    // polyfil if needed https://github.com/blueimp/JavaScript-Canvas-to-Blob
    
    // https://developers.google.com/web/fundamentals/primers/promises
    // https://stackoverflow.com/questions/42458849/access-blob-value-outside-of-canvas-toblob-async-function
    /*function getCanvasBlob(canvas) {
      return new Promise(function(resolve, reject) {
        canvas.toBlob(function(blob) { resolve(blob) }, 'image/jpeg');
        })
    }*/

    // some API's (like Azure Custom Vision) need a blob with image data
    /*getCanvasBlob(canvas).then(function(blob) {

        // do something with the image blob

    });*/

}

// https://hackernoon.com/how-to-use-javascript-closures-with-confidence-85cd1f841a6b
// closure; store this in a variable and call the variable as function
// eg. var takeSnapshotUI = createClickFeedbackUI();
// takeSnapshotUI();

function createClickFeedbackUI() {

    // in order to give feedback that we actually pressed a button. 
    // we trigger a almost black overlay
    var overlay = document.getElementById("video_overlay");//.style.display;

    // sound feedback
    var sndClick = new Howl({ src: ['snd/click.mp3'] });

    var overlayVisibility = false;
    var timeOut = 80;

    function setFalseAgain() {
        overlayVisibility = false;	
        overlay.style.display = 'none';
    }

    return function() {

        if(overlayVisibility == false) {
            sndClick.play();
            overlayVisibility = true;
            overlay.style.display = 'block';
            setTimeout(setFalseAgain, timeOut);
        }   

    }
}

/*function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('camerasensor');
  const ctx = canvas.getContext('2d');
  // since images are being fed from a webcam
  const flipHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();

      // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
      // version
      guiState.net = await posenet.load(+guiState.changeToArchitecture);

      guiState.changeToArchitecture = null;
    }

    // Begin monitoring code for frames per second
    //stats.begin();

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor;
    const outputStride = +guiState.input.outputStride;

    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    switch (guiState.algorithm) {
      case 'single-pose':
        const pose = await guiState.net.estimateSinglePose(
            video, imageScaleFactor, flipHorizontal, outputStride);
        poses.push(pose);

        minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
        minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;
        break;
      case 'multi-pose':
        poses = await guiState.net.estimateMultiplePoses(
            video, imageScaleFactor, flipHorizontal, outputStride,
            guiState.multiPoseDetection.maxPoseDetections,
            guiState.multiPoseDetection.minPartConfidence,
            guiState.multiPoseDetection.nmsRadius);

        minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
        minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;
        break;
    }

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });

    // End monitoring code for frames per second
    //stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}*/



