

import { EngineResult } from '../../../Interface/IEngineResults'
import { FormField } from '../../../Interface/IFormField';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const folderPath = '../../../CsvFiles/testData';
const path = require('path');
const stringSimilarity = require("string-similarity");
var expectedKey: string[], expectedValue: string[], actualKey: string[], actualValues: string[];
    var confidencearr: number[]

function similarity(str1: string, str2: string) {
  var similarity = stringSimilarity.compareTwoStrings(str1, str2);
  return similarity;
}
async function createCsv(expectedKey: string[], expectedValue: string[], actualKey: string[], actualValues: string[], confidencearr: number[]) {
  let fileName = "349b3c52-73da-4d0e-b25e-08c13eb54f33";
  let csvFilePath = `${folderPath}/${fileName}.csv`;
  let headers = [], rowData = [];
  var keyvalueObj: any = {}, ActualkeyvalueObj: any = {}, ScoreObj: any = {}
  // create headers
  for (let formFieldCount = 0; formFieldCount < expectedKey.length; formFieldCount++) {
    headers.push({ id: expectedKey[formFieldCount], title: expectedKey[formFieldCount] });
    let keyvalue = expectedKey[formFieldCount];
    keyvalueObj[keyvalue] = expectedValue[formFieldCount];
    ScoreObj[keyvalue] = confidencearr[formFieldCount];
    console.log("expected keys length", expectedKey.length)
    for (let j = 0; j < actualKey.length; j++) {
      if (expectedKey[formFieldCount].includes(actualKey[j])) {
        let keyvalue = expectedKey[formFieldCount];
        ActualkeyvalueObj[keyvalue] = actualKey[j];

      }
      else {
        if (formFieldCount == actualKey.length) {
          let keyvalue = expectedKey[formFieldCount];
          ActualkeyvalueObj[keyvalue] = " "
        }
      }
    }
  }
  rowData.push((keyvalueObj));
  rowData.push((ActualkeyvalueObj));
  rowData.push(ScoreObj);
  const csvWriter = await createCsvWriter({
    path: csvFilePath,
    header: headers
  });
  await csvWriter.writeRecords(rowData);
}

export class TestEngineResult {
  engineResult: EngineResult;
  expectedFormField: FormField;
  constructor(engineResult: EngineResult, expectedFormField: FormField) {
    this.engineResult = engineResult;
    this.expectedFormField = expectedFormField;
  }

  validateFormField(engineFormField: FormField[], expectedFormField: FormField[]) {
    let confidence = 100;
    

    for (let expectedKeysCount = 0; expectedKeysCount < expectedFormField.length; expectedKeysCount++) {

      expectedKey.push(expectedFormField[expectedKeysCount].key.content)
      expectedValue.push(expectedFormField[expectedKeysCount].value.content)
      //console.log("form fields",engineFormField)
      engineFormField.forEach(v => {

        if ((expectedFormField[expectedKeysCount].key.content).includes(v.key.content)) {
          // csv

          const expectedLabel = expectedFormField[expectedKeysCount].key.content;
          const expectedValue = expectedFormField[expectedKeysCount].value.content;
          // engine result

          const actualLabel = v.key.content;
          const actualValue = v.value.content;
          actualKey.push(v.key.content);
          actualValues.push(v.value.content)

          // expectation vs reality
          confidence = similarity(expectedLabel, actualLabel);
          confidencearr.push(confidence);
          // const valueScore = similarity(expectedValue, actualValue);
          // confidence = (labelScore + valueScore) / 2;

        }
      })
    }
    console.log("Expected Keys", expectedKey);
    console.log("Expected Value", expectedValue);
    console.log("actualKey", actualKey);
    console.log("actualValue", actualValues);
    console.log("confidencearr", confidencearr);
    createCsv(expectedKey, expectedValue, actualKey, actualValues, confidencearr);
  }

}

