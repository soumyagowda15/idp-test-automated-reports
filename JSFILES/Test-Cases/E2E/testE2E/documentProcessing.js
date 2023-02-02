"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEngineResult = void 0;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const configData = require('../../../Configuration-Test_Data/config/test_Config');
const testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json');
const genericMethods = require('../../../generic-Methods/generic_Methods');
function similarity(str1, str2) {
    console.log("similarity check for ", str1, str2);
    return str1 == str2 ? 100 : 0;
}
class TestEngineResult {
    constructor(engineResult, formFields) {
        this.engineResult = engineResult;
        this.formFields = formFields;
    }
    validateFormField(expectedFormField, engineFormField) {
        let confidence = 100;
        console.log("expectedFormField", expectedFormField);
        for (let i = 0; i < expectedFormField.length; i++) {
            console.log("iteration", i);
            engineFormField.forEach(v => {
                var comparisionKeys = Object.keys(expectedFormField[0]);
                var comparisionValues = Object.values(expectedFormField[0]);
                console.log("comparisionKeys[i]", comparisionKeys[i]);
                console.log("comparisionValues[i]", comparisionValues[i]);
                const expectedLabel = comparisionKeys[i];
                const expectedValue = comparisionValues[i];
                const actualLabel = v.key.content;
                const actualValue = v.value.content;
                const labelScore = similarity(expectedLabel, actualLabel);
                const valueScore = similarity(expectedValue, actualValue);
                confidence = (labelScore + valueScore) / 2;
            });
        }
        return confidence;
    }
}
exports.TestEngineResult = TestEngineResult;
