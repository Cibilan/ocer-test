
const express = require('express')
const fs = require('fs')

// const tf = require('@tensorflow/tfjs')
const tf = require('@tensorflow/tfjs-node')
const automl = require('@tensorflow/tfjs-automl')

// const tf = require('./resources/js/tf.min.js')
// const automl = require('./resources/js/tf-automl.min.js')

// const modelUrl = require('./resources/model/model.json'); // URL to the model.json file.
//const imageUrl = require('./resources/model/myPan.jpg');
const app = express();

const loadDictionary = modelUrl => {
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixUrl = lastIndexOfSlash >= 0 ? modelUrl.slice(0,
        lastIndexOfSlash + 1) : "";
    const dictUrl = `${prefixUrl}dict.txt`;
    const text = fs.readFileSync(dictUrl, { encoding: "utf-8" }); return text.trim().split("\n");
};



app.use('/useAutoml', async (req, res) => {

    try {
        // console.log(modelUrl);
        //console.log(__dirname + '/resources/model/model.json')
        let modelUrl = "./model.json"
        const [model, dict] = await Promise.all([tf.loadGraphModel(`file://${modelUrl}`),
        loadDictionary(modelUrl)
        ]);

        const objectDetction = async modelUrl => {
            const [model, dict] = await Promise.all([
                tf.loadGraphModel(`file://${modelUrl}`),
                loadDictionary(modelUrl)
            ]);
            return new automl.ObjectDetectionModel(model, dict);
        };

        const re = await objectDetction(modelUrl)
        const decodeImage = imgPath => {
            const imgSrc = fs.readFileSync(imgPath);
            const arrByte = Uint8Array.from(Buffer.from(imgSrc));
            return tf.node.decodeImage(arrByte);
        };
        let image = await decodeImage('./myPan.jpg')
        const ir = await re.detect(image)
        console.log(ir);

        // const model = await automl.loadObjectDetection('model.json');

        //    const img = document.getElementById(imageUrl);
        //     const options = {score: 0.5, iou: 0.5, topk: 20};
        //     const predictions = await model.detect(img, options);

        res.send('success');
    } catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use('/useTfjsNode', async (req, res) => {



})




app.use((req, res, next) => {
    res.send("page not found");
})



app.listen(3000);



