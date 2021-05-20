const fs = require("fs");
const path = require("path");

function Convertion(
  FilePath,
  Delimeter = ",",
  ConvertToJson = true,
  IsHeaderLine = true
) {
  const sourceFilePath = path.resolve(FilePath);
  let result = [];

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(sourceFilePath);

    rs.on("error", function (error) {
      reject(error);
    });

    rs.on("data", function (chunk) {
      if (ConvertToJson) {
        let arrData = chunk.toString().split("\r");

        if (arrData[0].indexOf(Delimeter) > -1) {
          let allData = arrData.map((rowData) => rowData.split(Delimeter));

          if (IsHeaderLine) {
            let headers = allData[0];
            allData = allData.slice(1);

            allData = allData.map((rowData) => {
              const obj = {};
              rowData.forEach((element, index) => {
                const headerName = headers[index];
                obj[headerName] = element;
              });
              result.push(obj);
            });
          } else {
            result.push(allData);
          }
        } else {
          reject("Not a valid CSV file");
        }
      } else {
        if (IsJsonString(chunk.toString())) {
          let jsonData = JSON.parse(chunk.toString());

          result = jsonData.map((row) => Object.values(row));
          result.unshift(Object.keys(jsonData[0]));
          result.join("\n");
        } else {
          reject("Not a valid JSON file");
        }
      }
    });

    rs.on("end", function () {
      resolve(result);
    });
  });
}

function IsJsonString(strJson) {
  try {
    JSON.parse(strJson);
  } catch (e) {
    return false;
  }
  return true;
}

async function GetConvertedData(filePath) {
  try {
    const data = await Convertion(filePath);

    console.log("GetConvertedData: parsed data:", data);
  } catch (error) {
    console.error("GetConvertedData: An error occurred: ", error);
  }
}

module.exports = {
  Convertion,
  GetConvertedData,
};
