"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const folderPath = '../../../CsvFiles/testData';
const path = require('path');
module.exports = {
    createCsv: (expectedKey, expectedValue, actualKey, actualValues, confidenceKey, confidenceValue) => __awaiter(void 0, void 0, void 0, function* () {
        let csvFilePath = `${folderPath}/${(0, uuid_1.v4)()}.csv`;
        let headers = [];
        let actualKeyObj = {};
        let actualValueObj = {};
        let valueConfidenceObj = {};
        let keyConfidenceObj = {};
        let expectedValueObj = {};
        actualKeyObj["EXPECTED_KEYS"] = "ACTUAL_KEYS";
        actualValueObj["EXPECTED_KEYS"] = "ACTUAL_VALUES";
        keyConfidenceObj["EXPECTED_KEYS"] = "KEY_CONFIDENCE";
        valueConfidenceObj["EXPECTED_KEYS"] = "VALUE_CONFIDENCE";
        for (let formFieldCount = 0; formFieldCount < expectedKey.length; formFieldCount++) {
            headers.push({ id: expectedKey[formFieldCount], title: expectedKey[formFieldCount] });
            let keyvalue = expectedKey[formFieldCount];
            expectedValueObj[keyvalue] = expectedValue[formFieldCount];
            for (let KeyValueScoreCount = 0; KeyValueScoreCount < actualKey.length; KeyValueScoreCount++) {
                if (expectedKey[formFieldCount].includes(actualKey[KeyValueScoreCount])) {
                    actualKeyObj[keyvalue] = actualKey[KeyValueScoreCount];
                    keyConfidenceObj[keyvalue] = confidenceKey[KeyValueScoreCount];
                    actualValueObj[keyvalue] = actualValues[KeyValueScoreCount];
                    valueConfidenceObj[keyvalue] = confidenceValue[KeyValueScoreCount];
                    break;
                }
                else {
                    if (formFieldCount == actualKey.length) {
                        actualKeyObj[keyvalue] = " ";
                        keyConfidenceObj[keyvalue] = " ";
                        valueConfidenceObj[keyvalue] = " ";
                        actualValueObj[keyvalue] = " ";
                    }
                }
            }
        }
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: headers
        });
        csvWriter.writeRecords([actualKeyObj, keyConfidenceObj, expectedValueObj, actualValueObj, valueConfidenceObj]);
    })
};
