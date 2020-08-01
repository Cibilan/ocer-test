
const express = require('express')
const jimp = require('jimp')

const app = express();

const ob = require('./objectDetect');
const vs = require('./visionServices');
const util = require('./util');
const ta = require('./textAnalyser');

app.use('/useAutoml', async (req, res) => {

    try {

        let imageUrl = req.query.url;

        //let imageUrl = "https://storage.googleapis.com/pancards/Deepak%20pal_PAN.jpg"

        await util.downloadImage(imageUrl);

        let downloadLocation = "./images/sample.jpg"
        
        //use object model and object bounds
        const ir = await ob.getObjectBounds(downloadLocation);

        //get ocr text
        const imageText = await vs.getDocumentText(imageUrl)
          
        const annotation = imageText.data.responses[0].fullTextAnnotation
        
        // read PAN/ NAME etc from OCR data
        ir.forEach(object => {
            let x = object.box.left
            let y = object.box.top
            let width = object.box.width
            let height = object.box.height
            
            let text = util.getTextFromBound(annotation, x, y, width, height);
            console.log(object.label.replace('\r', ''), text);
        });    
       
        res.send("success");
        
    } catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use('/jimp' , async (req,res) => {
    let imageUrl = "https://storage.googleapis.com/pancards/pancard_sample_rotated.jpg"
    try {
    const imageData = await vs.getTextAndFace(imageUrl);

    let faceAngel = imageData.data.responses[0].faceAnnotations[0].rollAngle;
    
    console.log(faceAngel);
       
    jimp.read(imageUrl)
    .then(image => {
        return image
        .rotate(faceAngel)
        .write('jimpOutput.jpg')
    })

    res.send('success');

    } catch (error) {
        console.log(error);
        res.send('error');
    }
})


app.use('/textAnalyser', async (req,res,next)=>{

    try{
        let inputText = "hello how are you? I'm fine, good to see you. good";

        let tokenized = await ta.tokenizerv1(inputText);

        // let tokenized2 = await ta.tokenizerv2(inputText);
        // console.log(tokenized2);

        console.log(tokenized);

        

        res.send('success');

    }catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use((req, res, next) => {
    res.send("page not found");
})




app.listen(3000);



