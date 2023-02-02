import { v4 as uuidv4 } from 'uuid';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const folderPath = '../../../CsvFiles/testData';
const path = require('path');
module.exports = {

    createCsv: async (expectedKey: string[], expectedValue: any[], actualKey: string[], actualValues: string[], confidenceKey: any[], confidenceValue: any) => {

        let csvFilePath = `${folderPath}/${uuidv4()}.csv`;
        let headers = [], rowData = [];
        var expectedValueObj: any = {}, ActualkeyObj: any = {}, ScoreKeyObj: any = {}, ScoreValueObj: any = {}, ActualValueObj: any = {};

        //Add Lables to csv file
        ActualkeyObj["EXPECTED_KEYS"] = "ACTUAL_KEYS"
        ActualValueObj["EXPECTED_KEYS"] = "ACTUAL_VALUES";
        ScoreKeyObj["EXPECTED_KEYS"] = "KEY_CONFIDENCE";
        ScoreValueObj["EXPECTED_KEYS"] = "VALUE_CONFIDENCE";
        // create rowData for csv
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
        // create csv with the header
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: headers
        });
        csvWriter.writeRecords(rowData);
    }

}
