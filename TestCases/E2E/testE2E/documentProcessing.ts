

import { EngineResult } from '../../../EngineInterface/IEngineResults'
import { FormField } from '../../../EngineInterface/IFormField';
const csvCreation = require('./createCsv.ts');
const stringSimilarity = require("string-similarity");
var expectedLabel:any,expectedValue:any,actualLabel:any,actualValue:any;
function similarity(str1: any, str2: string) {
  if (str1=="date" && isNaN(Date.parse(str2)))
  {
     str2="date";
  }
  var similarity = stringSimilarity.compareTwoStrings(str1, str2);
  return similarity;
}


export class TestEngineResult {
  engineResult: EngineResult;
  expectedFormField: FormField;
  constructor(engineResult: EngineResult, expectedFormField: FormField) {
    this.engineResult = engineResult;
    this.expectedFormField = expectedFormField;
  }

  validateFormField(engineFormField: FormField[], expectedFormField: FormField[],fileName:string) {

    var expectedKeyarr: string[] = ["EXPECTED_KEYS"], expectedValuearr: any[] = ["EXPECTED_VALUES"], actualKeyarr: string[] = [], actualValuesarr: any[] = [], confidenceValuearr: any[] = [], confidenceKeyarr: any[] = [];
    for (let expectedKeysCount = 0; expectedKeysCount < expectedFormField.length; expectedKeysCount++) {

      // push all expected keys and values
      expectedKeyarr.push(expectedFormField[expectedKeysCount].key.content);
      expectedValuearr.push(expectedFormField[expectedKeysCount].config?._n_field_type_);
      // compare expected(Document) and Actual(Engine Results)
      engineFormField.forEach(v => {
        if ((expectedFormField[expectedKeysCount].key.content).includes(v.key.content)) {
           expectedLabel = expectedFormField[expectedKeysCount].key.content;
           expectedValue = expectedFormField[expectedKeysCount].config?._n_field_type_;
           actualLabel = v.key.content;
           actualValue = typeof (v.value.content);
          // push all Actual keys and values
          actualKeyarr.push(v.key.content);
          actualValuesarr.push(v.value.content);
          // expectation vs reality--Comparision
          var confidenceLabel = similarity(expectedLabel, actualLabel);
          confidenceKeyarr.push(confidenceLabel);
          var confidenceValue = similarity(expectedValue, actualValue);

          confidenceValuearr.push(confidenceValue);
          // confidence = (labelScore + valueScore) / 2;
          
        }
      })
    }
    console.log("expectedKeyarr",expectedKeyarr)
    console.log("expectedValuearr",expectedValuearr)
    console.log("actualKeyarr",actualKeyarr)
    console.log("actualValuesarr",actualValuesarr)
    console.log("confidenceKeyarr",confidenceKeyarr)
    console.log("confidenceValuearr",confidenceValuearr)
    // create csv file
    csvCreation.createCsv(expectedKeyarr, expectedValuearr, actualKeyarr, actualValuesarr, confidenceKeyarr, confidenceValuearr,fileName);
  }
}

