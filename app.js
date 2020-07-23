
const express = require('express')
const fs = require('fs')

// const tf = require('@tensorflow/tfjs')
const tf = require('@tensorflow/tfjs-node')
const automl = require('@tensorflow/tfjs-automl')
const axios =  require('axios');

const app = express();

const loadDictionary = modelUrl => {
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixUrl = lastIndexOfSlash >= 0 ? modelUrl.slice(0,
        lastIndexOfSlash + 1) : "";
    const dictUrl = `${prefixUrl}dict.txt`;
    const text = fs.readFileSync(dictUrl, { encoding: "utf-8" }); return text.trim().split("\n");
};

const objectDetction = async modelUrl => {
    const [model, dict] = await Promise.all([
        tf.loadGraphModel(`file://${modelUrl}`),
        loadDictionary(modelUrl)
    ]);
    return new automl.ObjectDetectionModel(model, dict);
};

const decodeImage = imgPath => {
    const imgSrc = fs.readFileSync(imgPath);
    const arrByte = Uint8Array.from(Buffer.from(imgSrc));
    return tf.node.decodeImage(arrByte);
};



app.use('/useAutoml', async (req, res) => {

    try {
       
        let modelUrl = "./model.json"
        let imageUrl = "./myPan.jpg"

        const re = await objectDetction(modelUrl)
    
        let image = await decodeImage(imageUrl)
        const ir = await re.detect(image)

        const imageText = await axios({
            url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBOuePWkLQba4ruG1YppzWjdXZMJ8kC9Pk',
            method: 'post',
            headers: {
                Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            data:{
                "requests": [
                  {
                    "features": [
                      {
                        "type": "DOCUMENT_TEXT_DETECTION"
                      }
                    ],
                    "image": {
                      "source": {
                        "imageUri": "https://storage.googleapis.com/pancards/pancard_sample.webp"
                      }
                    }
                  }
                ]
              }
          });

        const annotation = imageText.data.responses[0].fullTextAnnotation


        //console.log(ir);

        res.send('success');
    } catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use((req, res, next) => {
    res.send("page not found");
})




app.listen(3000);



