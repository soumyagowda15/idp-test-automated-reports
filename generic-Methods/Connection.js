
const MongoClient = require('mongodb').MongoClient;
const configData=require('../Configuration-Test_Data/config/test_Config')
module.exports = {
    


   
connectTestMongoDB: async () => {
    try {
        let client = await MongoClient.connect(configData.MONGO_TEST_DB_ENVIRONMENTS.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return client;
    } catch (error) {
        return error;
    }
}
    }