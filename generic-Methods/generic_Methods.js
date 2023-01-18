const got = require('got');
const formData=require('formdata-node');
const addContext = require('mochawesome/addContext')
const connectionData=require('./Connection');
const configData=require('../Configuration-Test_Data/config/test_Config');
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
mongoDBDataFetch: async (strCollectionName, jsonDataFieldToSearch, strFieldName, strClrCollection) => {
    try {
        let elements = [];
        let items;
        
            client = await connectionData.connectTestMongoDB();
        let database = await client.db(configData.MONGO_TEST_DB_ENVIRONMENTS.MONGODB_DATABASE_NAME)
        let collection = await database.collection(strCollectionName)

        if (strClrCollection) {
            items = await collection.deleteMany({});
        }
        if (jsonDataFieldToSearch != "") {
            items = await collection.find(jsonDataFieldToSearch).toArray();
        } else {
            items = await collection.find().toArray();
        }
        if (strFieldName != "") {
            items.forEach(element => {
                elements.push(element[strFieldName]);
            });
        } else {
            elements = items;
        }
        // client.close();
        return elements;
    } catch (err) {
        console.log(err)
    }
}
}