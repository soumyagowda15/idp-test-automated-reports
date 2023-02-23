const got = require('got');
const addContext = require('mochawesome/addContext')
const configData=require('../ConfigurationTestData/config/test_Config');
let client = null;
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    postApiCall: async (strURL, strParams) => {
    try {
        const response = await got.post(strURL, strParams);
        return response;
    } catch (error) {
        return error;
    }
},
getApiCall: async (strURL, strParams) => {
    try {
        const response = await got.get(strURL, strParams);
        return response;
    } catch (error) {
        return error;
    }
},
addContext: (object, title, value) => {
    try {
        addContext(object, {
            title: title,
            value: value
        });
    } catch (error) {
        return error
    }
},
mongoDBDataFetch: async (strCollectionName, jsonDataToSearch) => {
    try {
        let elements = [];
        client = await MongoClient.connect(configData.MONGO_DB_ENVIRONMENTS[configData.environment].MONGODB_URI);
        let database = await client.db(configData.MONGO_DB_ENVIRONMENTS[configData.environment].MONGODB_DATABASE_NAME);
        let collection = await database.collection(strCollectionName);

        if (jsonDataToSearch != "") {
            elements = await collection.find(jsonDataToSearch).toArray();
        }
        return elements;
    } catch (err) {
        console.log(err)
    }
}
}