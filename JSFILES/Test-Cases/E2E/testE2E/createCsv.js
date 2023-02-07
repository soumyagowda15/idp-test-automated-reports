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
        let headers = [], rowData = [];
        var expectedValueObj = {}, ActualkeyObj = {}, ScoreKeyObj = {}, ScoreValueObj = {}, ActualValueObj = {};
        ActualkeyObj["EXPECTED_KEYS"] = "ACTUAL_KEYS";
        ActualValueObj["EXPECTED_KEYS"] = "ACTUAL_VALUES";
        ScoreKeyObj["EXPECTED_KEYS"] = "KEY_CONFIDENCE";
        ScoreValueObj["EXPECTED_KEYS"] = "VALUE_CONFIDENCE";
        for (let formFieldCount = 0; formFieldCount < expectedKey.length; formFieldCount++) {
            headers.push({ id: expectedKey[formFieldCount], title: expectedKey[formFieldCount] });
            let keyvalue = expectedKey[formFieldCount];
            expectedValueObj[keyvalue] = expectedValue[formFieldCount];
            for (let KeyValueScoreCount = 0; KeyValueScoreCount < actualKey.length; KeyValueScoreCount++) {
                if (expectedKey[formFieldCount].includes(actualKey[KeyValueScoreCount])) {
                    ActualkeyObj[keyvalue] = actualKey[KeyValueScoreCount];
                    ScoreKeyObj[keyvalue] = confidenceKey[KeyValueScoreCount];
                    ActualValueObj[keyvalue] = actualValues[KeyValueScoreCount];
                    ScoreValueObj[keyvalue] = confidenceValue[KeyValueScoreCount];
                }
                else {
                    if (formFieldCount == actualKey.length) {
                        ActualkeyObj[keyvalue] = " ";
                        ScoreKeyObj[keyvalue] = " ";
                        ScoreValueObj[keyvalue] = " ";
                        ActualValueObj[keyvalue] = " ";
                    }
                }
            }
        }
        rowData.push(ActualkeyObj, ScoreKeyObj, expectedValueObj, ActualValueObj, ScoreValueObj);
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: headers
        });
        csvWriter.writeRecords(rowData);
    })
};
