
const express = require('express')

const tf = require('@tensorflow/tfjs')
const automl = require('@tensorflow/tfjs-automl')

//require('@tensorflow/tfjs-node')

const modelUrl = require('./resources/model.json'); // URL to the model.json file.

const app = express();


app.use('/useAutoml', async (req,res)=> {

    //const model = await automl.loadObjectDetection(modelUrl);

    res.send("hellpo");

})

app.use((req,res,next)=>{
    res.send("page not found");
})
 


app.listen(3000);



