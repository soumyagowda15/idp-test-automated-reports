"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEngineResult = void 0;
const csvCreation = require('./createCsv');
const stringSimilarity = require("string-similarity");
var expectedKeyarr = ["EXPECTED_KEYS"], expectedValuearr = ["EXPECTED_VALUES"], actualKeyarr = [], actualValuesarr = [], confidenceValuearr = [];
var confidenceKeyarr = [];
function similarity(str1, str2) {
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
        for (let expectedKeysCount = 0; expectedKeysCount < expectedFormField.length; expectedKeysCount++) {
            expectedKeyarr.push(expectedFormField[expectedKeysCount].key.content);
            expectedValuearr.push((_a = expectedFormField[expectedKeysCount].config) === null || _a === void 0 ? void 0 : _a._n_field_type_);
            engineFormField.forEach(v => {
                var _a;
                if ((expectedFormField[expectedKeysCount].key.content).includes(v.key.content)) {
                    const expectedLabel = expectedFormField[expectedKeysCount].key.content;
                    const expectedValue = (_a = expectedFormField[expectedKeysCount].config) === null || _a === void 0 ? void 0 : _a._n_field_type_;
                    const actualLabel = v.key.content;
                    const actualValue = typeof (v.value.content);
                    actualKeyarr.push(v.key.content);
                    actualValuesarr.push(v.value.content);
                    var confidenceLabel = similarity(expectedLabel, actualLabel);
                    confidenceKeyarr.push(confidenceLabel);
                    var confidenceValue = similarity(expectedValue, actualValue);
                    confidenceValuearr.push(confidenceValue);
                }
            });
        }
        csvCreation.createCsv(expectedKeyarr, expectedValuearr, actualKeyarr, actualValuesarr, confidenceKeyarr, confidenceValuearr);
    }
}
exports.TestEngineResult = TestEngineResult;
