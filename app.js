
const express = require('express')
const fs = require('fs')
const path = require('path')

const tf = require('@tensorflow/tfjs-node')
const automl = require('@tensorflow/tfjs-automl')
const axios =  require('axios');

const app = express();

const ob = require('./objectDetect');

async function objectDetction (modelUrl) {
    const [model, dict] = await Promise.all([
        tf.loadGraphModel(`file://${modelUrl}`),
        ob.loadDictionary(modelUrl)
    ]);
    return new automl.ObjectDetectionModel(model, dict);
};

function decodeImage(imgPath) {
    const imgSrc = fs.readFileSync(imgPath);
    const arrByte = Uint8Array.from(Buffer.from(imgSrc));
    return tf.node.decodeImage(arrByte);
};

function getWord(annotation, x1, y1, x2, y2) {
    let text = "";
    for (let pageIndex in annotation.pages) {
        let page = annotation.pages[pageIndex];
        for (let blockIndex in page.blocks) {
            let block = page.blocks[blockIndex];
            for (let paragraphIndex in block.paragraphs) {
                let paragraph = block.paragraphs[paragraphIndex];
                for (let wordIndex in paragraph.words) {
                    let word = paragraph.words[wordIndex];
                    for (let symbolIndex in word.symbols) {
                        let symbol = word.symbols[symbolIndex];
                        let min_x = Math.min(
                            symbol.boundingBox.vertices[0].x,
                            symbol.boundingBox.vertices[1].x,
                            symbol.boundingBox.vertices[2].x,
                            symbol.boundingBox.vertices[3].x,
                        );
                        let max_x = Math.max(
                            symbol.boundingBox.vertices[0].x,
                            symbol.boundingBox.vertices[1].x,
                            symbol.boundingBox.vertices[2].x,
                            symbol.boundingBox.vertices[3].x,
                        );
                        let min_y = Math.min(
                            symbol.boundingBox.vertices[0].y,
                            symbol.boundingBox.vertices[1].y,
                            symbol.boundingBox.vertices[2].y,
                            symbol.boundingBox.vertices[3].y,
                        );
                        let max_y = Math.max(
                            symbol.boundingBox.vertices[0].y,
                            symbol.boundingBox.vertices[1].y,
                            symbol.boundingBox.vertices[2].y,
                            symbol.boundingBox.vertices[3].y,
                        );
                        if (
                            min_x >= x1 &&
                            max_x <= x2 &&
                            min_y >= y1 &&
                            max_y <= y2
                        ) {
                            text += symbol.text;

                            // if (symbol.property.detectedBreak != "undefined") {
                            //     if (
                            //         symbol.property.detectedBreak.type ==
                            //             "SPACE" ||
                            //         symbol.property.detectedBreak.type ==
                            //             "EOL_SURE_SPACE"
                            //     ) {
                            //         text += " ";
                            //     }

                            //     if (
                            //         symbol.property.detectedBreak.type ==
                            //         "TAB"
                            //     ) {
                            //         text += "\t";
                            //     }

                            //     if (
                            //         symbol.property.detectedBreak.type ==
                            //         "LINE_BREAK"
                            //     ) {
                            //         text += "\n";
                            //     }
                            // }
                        }
                    }
                }
            }
        }
    }
    return text;
}

async function downloadImage () {  
    const url = 'https://storage.googleapis.com/pancards/pancard_sample.jpg'
    const pathurl = path.resolve(__dirname, 'images', 'sample.jpg')
    const writer = fs.createWriteStream(pathurl)
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

app.use('/useAutoml', async (req, res) => {

    try {
       
        let modelUrl = "./model.json"

        await downloadImage();

        let imageUrl = "./images/sample.jpg"
        

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
                        "imageUri": "https://storage.googleapis.com/pancards/pancard_sample.jpg"
                      }
                    }
                  }
                ]
              }
          });

          
        const annotation = imageText.data.responses[0].fullTextAnnotation
        
       let name = getWord(annotation, 84, 506, 371, 563);
        console.log(name);
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use((req, res, next) => {
    res.send("page not found");
})




app.listen(3000);



