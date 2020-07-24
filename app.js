
const express = require('express')

const app = express();

const ob = require('./objectDetect');
const vs = require('./visionServices');
const util = require('./util');

app.use('/useAutoml', async (req, res) => {

    try {

        //let imageUrl = req.imageUrl

        let imageUrl = "https://storage.googleapis.com/pancards/pancard_sample.jpg"

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

app.use((req, res, next) => {
    res.send("page not found");
})




app.listen(3000);



