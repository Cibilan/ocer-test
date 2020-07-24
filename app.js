
const express = require('express')

const app = express();

const ob = require('./objectDetect');
const vs = require('./visionServices');
const util = require('./util');

app.use('/useAutoml', async (req, res) => {

    try {

        let imageUrl = "https://storage.googleapis.com/pancards/pancard_sample.jpg"

        await util.downloadImage(imageUrl);

        let downloadLocation = "./images/sample.jpg"
        
        const ir = await ob.getObjectBounds(downloadLocation);

        console.log(ir);

        const imageText = await vs.getDocumentText(imageUrl)
          
        const annotation = imageText.data.responses[0].fullTextAnnotation
        
       let name = util.getTextFromBound(annotation, 84, 506, 278, 57);

       
        console.log(name);
        res.send(name);
        
    } catch (error) {
        console.log(error);
        res.send('error');
    }

})

app.use((req, res, next) => {
    res.send("page not found");
})




app.listen(3000);



