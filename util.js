const axios =  require('axios');
const fs = require('fs')
const path = require('path')

exports.downloadImage = async(imageUrl) => {  
    const url = imageUrl
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

  exports.getTextFromBound = (annotation, left, top, width, height) => {
    let text = "";
    let x1 = left;
    let y1 = top;
    let x2 = left + width;
    let y2 = top + height;
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