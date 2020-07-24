const axios =  require('axios');

exports.getDocumentText = async(imageUrl) =>{

    return await axios({
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
                "imageUri": imageUrl
              }
            }
          }
        ]
      }
  });
}