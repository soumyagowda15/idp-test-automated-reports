
var fs1 = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fsExtra = require('fs-extra');

const configData = require('../../../Configuration-Test_Data/config/test_Config');
const testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json')
const genericMethods = require('../../../generic-Methods/generic_Methods');
const folderPath = '../../../CsvFiles/testData';
const dataGenerator = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration')
var MongoData;
var keys = [];
var values = []
var expectedKeys = [
  'd./File No.\n',
  'e / Passport No.\n',
  'regats/Country Code\n',
  '8414/Surname\n',
  '/Type\n',
  'PIN:',
  '/ Name of Mother\n',
  '/ Place of Issue\n',
  'of Date of Birth\n',
  'fafar / Date of Issue\n',
  'fa/ Given Name(s)\n',
  'ral/Nationality\n',
  'fein / Sex\n',
  'Given Name(s)\n',
  'PIN:',
  'BENGALURU, KARNATAKA\n',
  'Nationality'
]
var expectedValue = [
  'JP1068637285415\n',
  'Z5616287\n',
  'IND\n',
  'VARMA\n',
  'P\n',
  '695003, KERALA, INDIA\n',
  'LIZY THOMAS\n',
  'HYDERABAD\n',
  '26/07/1994\n',
  '29/04/2015\n',
  'PAUL\n',
  'INDIAN\n',
  'M\n',
  'SARATH KUMAR REDDY\n',
  '302020, RAJASTHAN, INDIA\n',
  'GIF / Place of Birth\n',
  'INDIAN\n'
]
var actualKey = [
  'PIN:',
  'Name of Mother\n',
  'Date of Birth\n',
  'fa/ Given Name(s)\n',
  'Nationality\n',
  'PIN:'
]
var actualValue = [
  '695003, KERALA, INDIA\n',
  'LIZY THOMAS\n',
  'HYDERABAD\n',
  '26/07/1994\n',
  '29/04/2015\n',
  'PAUL\n',
]
describe('csv', async function () {
  it("csv creation", async function () {
    MongoData = await genericMethods.mongoDBDataFetch("document", { "docid": "349b3c52-73da-4d0e-b25e-08c13eb54f33" }, '');
    console.log("MongoData", MongoData)
    let fileName = "349b3c52-73da-4d0e-b25e-08c13eb54f33";
    let csvFilePath = `${folderPath}/${fileName}.csv`;
    let headers = [], rowData = [];
    var keyvalueObj: any = {}, ActualkeyvalueObj: any = {}, ScoreObj: any = {}
    // create headers
    for (let formFieldCount = 0; formFieldCount < expectedKeys.length; formFieldCount++) {
      headers.push({ id: expectedKeys[formFieldCount], title: expectedKeys[formFieldCount] })
      let keyvalue = expectedKeys[formFieldCount];
      keyvalueObj[keyvalue] = expectedValue[formFieldCount];
  
    console.log("headers", headers)
      for (let j = 0; j < actualKey.length; j++) {
        console.log("iteration", formFieldCount)
        if (expectedKeys[formFieldCount].includes(actualKey[j])) {
          let keyvalue = expectedKeys[formFieldCount];
          ActualkeyvalueObj[keyvalue] = actualKey[j];

        }
        else {
          if (formFieldCount == expectedKeys.length) {
            let keyvalue = expectedKeys[formFieldCount];
            ActualkeyvalueObj[keyvalue] = " "
          }
      }
    }

    rowData.push((keyvalueObj));
    rowData.push((ActualkeyvalueObj));
    rowData.push(ScoreObj);
    console.log("ROWDATA", rowData)
    // create csv file
    const records = [];
    const csvWriter = await createCsvWriter({
      path: csvFilePath,
      header: headers
    });


    await csvWriter.writeRecords(rowData);



    /* console.log(JSON.stringify(MongoData[0]));
        
            // Use first element to choose the keys and the order
            let keys = Object.keys(MongoData[0]);
        
            // Build header
            let result = keys.join("\t") + "\n";
        
            // Add the rows
            MongoData.forEach(function(obj){
                result += keys.map(k => obj[k]).join("\t") + "\n";
            });
        
            return result; */

  
        }        })
})
