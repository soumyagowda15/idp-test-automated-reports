var FormData = require('form-data');
var fs = require('fs');
module.exports = {
    update_AttributeValue: (jsonData, strAttributeName, strAttributeValue) => {
        try {
            jsonData = JSON.parse(jsonData)
            jsonData[strAttributeName] = strAttributeValue
            return JSON.stringify(jsonData);
        } catch (error) {
            return error;
        }
    },
    getFormData:async (jsonData) =>{Object.keys(jsonData).reduce((formData, key) => {
                formData.append(key, jsonData[key]);
                return formData;
            }, new FormData());
     
}
}