
const express = require('express')
const fs = require('fs')

const tf = require('@tensorflow/tfjs')
const automl = require('@tensorflow/tfjs-automl')
//require('@tensorflow/tfjs-node')

// const tf = require('./resources/js/tf.min.js')
// const automl = require('./resources/js/tf-automl.min.js')

const dummy = require('./resources/model/dummy.json')
const modelUrl = require('./resources/model/model.json'); // URL to the model.json file.
//const imageUrl = require('./resources/model/myPan.jpg');
const app = express();


app.use('/useAutoml', async (req,res)=> {

    try {
       // console.log(modelUrl);
        //console.log(__dirname + '/resources/model/model.json')
       const model = await automl.loadObjectDetection('C:\projects\praveen\localnode\resources\model\model.json');

    //    const img = document.getElementById(imageUrl);
    //     const options = {score: 0.5, iou: 0.5, topk: 20};
    //     const predictions = await model.detect(img, options);
        
        res.send('success');
    } catch (error) {
        console.log(error);
        res.send( 'error');
    }

})

app.use('/useTfjsNode', async (req,res) => {

    

})




app.use((req,res,next)=>{
    res.send("page not found");
})
 


app.listen(3000);



