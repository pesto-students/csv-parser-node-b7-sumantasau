const path = require("path");
const { GetConvertedData } = require("./convertion");

const sourcFilePath = path.resolve(__dirname, "./Data/test.csv");

const resultData = GetConvertedData(sourcFilePath);

console.log(resultData);
