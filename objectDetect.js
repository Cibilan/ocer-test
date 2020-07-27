const fs = require('fs')
const path = require('path')
const tf = require('@tensorflow/tfjs-node')
const automl = require('@tensorflow/tfjs-automl')

function loadDictionary (modelUrl){
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixUrl = lastIndexOfSlash >= 0 ? modelUrl.slice(0,
        lastIndexOfSlash + 1) : "";
    const dictUrl = `${prefixUrl}dict.txt`;
    const text = fs.readFileSync(dictUrl, { encoding: "utf-8" }); return text.trim().split("\n");
};


async function objectDetction (modelUrl) {
    const [model, dict] = await Promise.all([
        tf.loadGraphModel(`file://${modelUrl}`),
        loadDictionary(modelUrl)
    ]);
    return new automl.ObjectDetectionModel(model, dict);
};

function decodeImage(imgPath) {
    const imgSrc = fs.readFileSync(imgPath);
    const arrByte = Uint8Array.from(Buffer.from(imgSrc));
    return tf.node.decodeImage(arrByte);
};



exports.getObjectBounds = async(imageUrl) =>{

   // let modelUrl = "./automlModels/firstPanModel/model.json"
   let modelUrl = "./automlModels/modelPanHorizontalVertical/model.json"


    const re = await objectDetction(modelUrl)

    let image = await decodeImage(imageUrl)

    return await re.detect(image)
}