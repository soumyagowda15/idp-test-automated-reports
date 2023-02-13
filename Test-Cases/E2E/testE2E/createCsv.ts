import { v4 as uuidv4 } from 'uuid';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const folderPath = './CsvFiles/testData';
const path = require('path');
module.exports = {

    createCsv: async (expectedKey: string[], expectedValue: any[], actualKey: string[], actualValues: string[], confidenceKey: any[], confidenceValue: any) => {

        let csvFilePath = `${folderPath}/${uuidv4()}.csv`;
        let headers = [];
        let actualKeyObj: any = {};
        let  actualValueObj: any = {};
        let valueConfidenceObj: any = {}
        let  keyConfidenceObj: any = {};
        let expectedValueObj: any = {};

        //Add Lables to csv file
        actualKeyObj["EXPECTED_KEYS"] = "ACTUAL_KEYS"
        actualValueObj["EXPECTED_KEYS"] = "ACTUAL_VALUES";
        keyConfidenceObj["EXPECTED_KEYS"] = "KEY_CONFIDENCE";
        valueConfidenceObj["EXPECTED_KEYS"] = "VALUE_CONFIDENCE";
        // create rowData for csv
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
        //rowData.push(actualKeyObj, keyConfidenceObj, expectedValueObj, actualValueObj, valueConfidenceObj);
        // create csv with the header
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: headers
        });
        csvWriter.writeRecords([actualKeyObj, keyConfidenceObj, expectedValueObj, actualValueObj, valueConfidenceObj]);
    }

}
