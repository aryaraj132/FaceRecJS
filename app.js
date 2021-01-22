const video = document.getElementById("video");

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia({
        video:{}
    },
    stream => (video.srcObject = stream),
    err => console.error(err)
    )
}

video.addEventListener('playing', ()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height:video.height};
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async()=>{
        const detection = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detection, displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
        resizedDetections.forEach(detection =>{
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: 'face'})
            drawBox.draw(canvas)
        })
    }, 100);
})

function loadImages(){
    const labels = ['Ankit Raj', 'Aryan Raj']
    return Promise.all(
        labels.map(async label =>{
            for (let i = 1; i <= 5; i++) {
                const img = await faceapi.fetchImage(`http://127.0.0.1:5500/face-data/${label}/${i}.jpeg`)
                document.body.append(img)
            }
        })
    )
}

loadImages();