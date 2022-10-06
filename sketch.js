// let clasificador
// let textoSalida = "tap classifier button"
// // aqui ponemos la ruta al modelo que hemos creado con teachable machine
// let rutaModelo = "https://teachablemachine.withgoogle.com/models/uPlAVHXtf/"
// let label_result = document.getElementById('label_result')
// let player = document.getElementById('player');
// let captureButton = document.getElementById('capture');
// let video
// let snapshot


// function preload() {
//   // Le pedimos a ml5 que nos cree un clasificador de imagenes y en vez de ponerle un modelo predefinido como MobileNet, le damos la ruta de nuestro modelo personalizado
//   clasificador = ml5.imageClassifier(rutaModelo + 'model.json')
// }

// function setup() {
//   let constraints = {
//     audio: false
//   };

//   video = createCapture(constraints);
//   video.hide()
//   snapshot = video.get(0, 0, 250, 300);

//   navigator.mediaDevices.getUserMedia({
//     video: {
//       facingMode: 'environment',
//     zoom:5
    
//     }
//   })
//     .then(handleSuccess);

// }

// const handleSuccess = (stream) => {
//   // Attach the video stream to the video element and autoplay.
//   player.srcObject = stream;
// };


// captureButton.addEventListener('click', () => {
//   // Draw the video frame to the canvas.
//   // Capturamos imagenes de la webcam y las metemos en una letiable llamada webcam
//   clasificador.classify(snapshot, clasificacionCompletada)
//   setTimeout(() => {label_result.innerHTML = "";  }, 3000);
// console.log('click')
// });



// const clasificacionCompletada = (error, resultado) => {
//   // el clasificador nos pasa 2 argumentos, el error y el resultado de la clasificacion
//   // el resultado es una lista de objetos, nos quedamos solo con el primero y con el atributo label que es la etiqueta, y lo guardamos en la variable textoSalida para mostrarlo por el lienzo
//   textoSalida = resultado[0].label
//   html = '<h2>' + textoSalida + '</h2>';
//   label_result.innerHTML = html;

//   console.log(resultado)
// }

    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/uPlAVHXtf/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup({facingMode: "environment"}); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
