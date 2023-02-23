var FormData = require('form-data');
var fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fsExtra = require('fs-extra');

module.exports = {
    encodeData:(jsonData)=>
    {
        let formBody = [];
        for (var data in jsonData) {
          var encodedKey = encodeURIComponent(data);
          var encodedValue = encodeURIComponent(jsonData[data]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        body = formBody.join("&");
        return body;
    },
    update_AttributeValue: (jsonData,strAttributeName,strAttributeValue) => {
        try {
                jsonData[strAttributeName]=strAttributeValue;
            return jsonData;
        } catch (error) {
            return error;
        }
    },
   
    update_AttributeValue1: (jsonData,strAttributeValue1,strAttributeValue2,strAttributeValue3) => {
        try {
            
                jsonData.client_id=strAttributeValue1;
                jsonData.client_secret=strAttributeValue2;
                jsonData.grant_type=strAttributeValue3
           
            return jsonData;
        } catch (error) {
            return error;
        }
    },
    remove_Attribute: (jsonData, strAttributeName) => {
        try {
            delete jsonData[strAttributeName];
            return jsonData;
        }
        catch (error) {
            return error;
        }
    },
    getFormData: async (jsonData) => {
        Object.keys(jsonData).reduce((formData, key) => {
            formData.append(key, jsonData[key]);
            return formData;
        }, new FormData());

    },
    cvsToJson: async (csvFilePath) => {
        csv().fromFile(csvFilePath).then((jsonObj) => { })
        const jsonArray = await csv().fromFile(csvFilePath);
        return jsonArray;
    },
    createCsvFile: async (csvFilePath, header, rowData) => {
        try {
            const records = [];
            const csvWriter = createCsvWriter({
                path: csvFilePath,
                header: header
            });
            records.push(rowData);
            await csvWriter.writeRecords(records);
        } catch (error) {
            return error;
        }
    },
    convertToCSV: async (arr) => {
        const array = [Object.keys(arr[0])].concat(arr)

        return array.map(it => {
            return Object.values(it).toString()
        }).join('\n')
    }
}