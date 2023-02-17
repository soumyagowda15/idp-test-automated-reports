const got = require('got');
const addContext = require('mochawesome/addContext')
const connectionData=require('./Connection');
const configData=require('../ConfigurationTestData/config/test_Config');
let client = null

module.exports = {
    postAPICall: async (strURL, strParams) => {
    try {
        const response = await got.post(strURL, strParams);
        return response;
    } catch (error) {
        return error;
    }
},
getAPICall: async (strURL, strParams) => {
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
mongoDBDataFetch: async (strCollectionName, jsonDataFieldToSearch) => {
    try {
        let elements = [];
        
        client = await connectionData.connectTestMongoDB();
        let database = await client.db(configData.MONGO_TEST_DB_ENVIRONMENTS.MONGODB_DATABASE_NAME)
        let collection = await database.collection(strCollectionName)

       
        if (jsonDataFieldToSearch != "") {
            elements = await collection.find(jsonDataFieldToSearch).toArray();
        } else {
            elements = await collection.find().toArray();
        }
       
        return elements;
    } catch (err) {
        console.log(err)
    }
}
}