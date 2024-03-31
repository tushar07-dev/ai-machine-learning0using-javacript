const modelParams = {
    flipHorizontal: true,
    imageScaleFactor: 1,
    maxNumBoxes: 5,
    iouThreshold: 0.5,
    scoreThreshold: 0.90,
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d'); 
// console.log(handTrack.startVideo);
// const img = document.getElementById('img'); 
// const model =  await handTrack.load();
// const predictions = await model.detect(img);

let model;
let intervalId; 
// console.log(video.style);
video.requestFullscreen();

handTrack.startVideo(video).then(status => {
    if(status){
        navigator.getUserMedia(
            {video:{}},
            stream => {
                video.srcObject = stream;
                intervalId = setInterval(runDetection, 1000);
            },
            error => console.log(error),
            );
    }
})

function runDetection(){
    model.detect(video).then(predictions => {
        // console.log(predictions);
        if(predictions.length > 0){
            model.renderPredictions(predictions, canvas, context, video);
            callAudio(predictions);
        }
    })
}

function callAudio(arrayOfObjects){
    const handCount = arrayOfObjects.reduce((count, obj) => {
        return obj.label === 'open' ? count + 1 : count;
    }, 0);
    console.log(handCount);
    if (handCount > 1) {
        stopVideoStreamAndShowLandingPage();
    } else {
        audio.play();
    }
}
function stopVideoStreamAndShowLandingPage() {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.style.display = 'none';
    canvas.style.display = 'none';
    audio.style.display = 'none';
    const landingPage = document.createElement('div');
    landingPage.textContent = "Wanted! You're arrested now";
    landingPage.classList.add('crime-police'); // Apply the crime-police class
    document.body.appendChild(landingPage);

    clearInterval(intervalId); // Clear the interval when stopping video stream
}

handTrack.load(modelParams).then(lmodel => {model = lmodel;});