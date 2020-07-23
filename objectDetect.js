const fs = require('fs')

exports.loadDictionary = (modelUrl) => {
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixUrl = lastIndexOfSlash >= 0 ? modelUrl.slice(0,
        lastIndexOfSlash + 1) : "";
    const dictUrl = `${prefixUrl}dict.txt`;
    const text = fs.readFileSync(dictUrl, { encoding: "utf-8" }); return text.trim().split("\n");
};