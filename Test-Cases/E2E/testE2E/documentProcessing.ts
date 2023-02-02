

import { EngineResult } from '../../../Interface/IEngineResults'
import { FormField } from '../../../Interface/IFormField';
const csvCreation = require('./createCsv');
const stringSimilarity = require("string-similarity");
var expectedKeyarr: string[] = ["EXPECTED_KEYS"], expectedValuearr: any[] = ["EXPECTED_VALUES"], actualKeyarr: string[] = [], actualValuesarr: any[] = [], confidenceValuearr: any[] = [];
var confidenceKeyarr: any[] = [];

function similarity(str1: any, str2: string) {
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

  validateFormField(engineFormField: FormField[], expectedFormField: FormField[]) {


    for (let expectedKeysCount = 0; expectedKeysCount < expectedFormField.length; expectedKeysCount++) {

      // push all expected keys and values
      expectedKeyarr.push(expectedFormField[expectedKeysCount].key.content);
      expectedValuearr.push(expectedFormField[expectedKeysCount].config?._n_field_type_);
      // compare expected(Document) and Actual(Engine Results)
      engineFormField.forEach(v => {
        if ((expectedFormField[expectedKeysCount].key.content).includes(v.key.content)) {
          const expectedLabel = expectedFormField[expectedKeysCount].key.content;
          const expectedValue = expectedFormField[expectedKeysCount].config?._n_field_type_
          const actualLabel = v.key.content;
          const actualValue = typeof (v.value.content);
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

    // create csv file
    csvCreation.createCsv(expectedKeyarr, expectedValuearr, actualKeyarr, actualValuesarr, confidenceKeyarr, confidenceValuearr);

  }

}

