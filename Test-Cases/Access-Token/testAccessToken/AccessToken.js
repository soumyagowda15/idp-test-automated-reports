const assert=require('chai').assert;

const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const testData=require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json')
const genericMethods=require('../../../generic-Methods/generic_Methods');
const configData=require('../../../Configuration-Test_Data/config/test_Config')
const URL_ACCESS_TOKEN=configData.URL
describe("Get Access Token",async function(){

    it("Get an access token",async function(){
        var formBody = [];
        for (var data in testData) {
          var encodedKey = encodeURIComponent(data);
          var encodedValue = encodeURIComponent(testData[data]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        resp=await genericMethods.postAPICall(URL_ACCESS_TOKEN,{
            body:formBody,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
      genericMethods.addContext(this,'INPUT ',formBody);
      genericMethods.addContext(this,'OUTPUT ',resp.body);

      if(resp!==undefined)
      {
        bodyObj=JSON.parse(resp.body);
        assert.equal(resp.statusCode,HTTPStatusCodes.OK);
        assert.equal(resp.statusMessage,HTTPStatusCode.getMessage(200));

        // Fetch data from MongoDB
        await genericMethods.mongoDBDataFetch('clients', {
            "client_id" : "F1BV8hJ4G2L_Zt7-ZpLUS",
        }, '')
      }
      else
      {
          assert.fail(resp," is undefined");
      }
    })

    it("Create a Job", async function () {
      let body = JSON.stringify(createJobTestData);
      resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
          body: body,
          headers: {
              "Content-Type": "application/json",
              "tenant": "neutrinos",
              "Authorization": "Bearer 64xRTKPcW9HU5S7X0LMkOJJ2FV0EL3UADmKNo45XU8Q"
          }

      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
      if (resp !== undefined) {
          var bodyObj = JSON.parse(resp.body);
          console.log("JOB ID is", bodyObj[0]._id);
          JOB_ID = bodyObj[0]._id
      }
      else {
          assert.fail(resp, "is undefined")
      }
  })
})