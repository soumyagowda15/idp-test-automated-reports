"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEngineResult = void 0;
const csvCreation = require('./createCsv.ts');
const stringSimilarity = require("string-similarity");
function similarity(str1, str2) {
    if (str1 == "date" && isNaN(Date.parse(str2))) {
        str2 = "date";
    }
    var similarity = stringSimilarity.compareTwoStrings(str1, str2);
    return similarity;
}
class TestEngineResult {
    constructor(engineResult, expectedFormField) {
        this.engineResult = engineResult;
        this.expectedFormField = expectedFormField;
    }
    validateFormField(engineFormField, expectedFormField) {
        var _a;
        var expectedKeyarr = ["EXPECTED_KEYS"], expectedValuearr = ["EXPECTED_VALUES"], actualKeyarr = [], actualValuesarr = [], confidenceValuearr = [], confidenceKeyarr = [];
        for (let expectedKeysCount = 0; expectedKeysCount < expectedFormField.length; expectedKeysCount++) {
            expectedKeyarr.push(expectedFormField[expectedKeysCount].key.content);
            expectedValuearr.push((_a = expectedFormField[expectedKeysCount].config) === null || _a === void 0 ? void 0 : _a._n_field_type_);
            engineFormField.forEach(v => {
                var _a;
                if ((expectedFormField[expectedKeysCount].key.content).includes(v.key.content)) {
                    var expectedLabel, expectedValue, actualLabel, actualValue;
                    expectedLabel = expectedFormField[expectedKeysCount].key.content;
                    expectedValue = (_a = expectedFormField[expectedKeysCount].config) === null || _a === void 0 ? void 0 : _a._n_field_type_;
                    actualLabel = v.key.content;
                    actualValue = typeof (v.value.content);
                    actualKeyarr.push(v.key.content);
                    actualValuesarr.push(v.value.content);
                    var confidenceLabel = similarity(expectedLabel, actualLabel);
                    confidenceKeyarr.push(confidenceLabel);
                    var confidenceValue = similarity(expectedValue, actualValue);
                    confidenceValuearr.push(confidenceValue);
                }
            });
        }
        console.log("expectedKeyarr", expectedKeyarr);
        console.log("expectedValuearr", expectedValuearr);
        console.log("actualKeyarr", actualKeyarr);
        console.log("actualValuesarr", actualValuesarr);
        console.log("confidenceKeyarr", confidenceKeyarr);
        console.log("confidenceValuearr", confidenceValuearr);
        csvCreation.createCsv(expectedKeyarr, expectedValuearr, actualKeyarr, actualValuesarr, confidenceKeyarr, confidenceValuearr);
    }
}
exports.TestEngineResult = TestEngineResult;
