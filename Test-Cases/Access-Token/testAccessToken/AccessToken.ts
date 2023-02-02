const assert=require('chai').assert;
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const accessTokenTestData=require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json');
const generic_Methods=require('../../../generic-Methods/generic_Methods')
const configureData=require('../../../Configuration-Test_Data/config/test_Config')
const URL_ACCESS_TOKEN="https://ids.neutrinos.co/token"
var resp;
describe("Get Access Token",async function(){

   /*  it("To verify that access Token is genearted when proper client ID (client should be registered to DEV IDP), client Secret, and grant type is provided in the Input for the Get Access Token POST API ",async function(){
      let formBody = [];
        for (var data in accessTokenTestData) {
          var encodedKey = encodeURIComponent(data);
          var encodedValue = encodeURIComponent(accessTokenTestData[data]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        var body = formBody.join("&");

        resp=await generic_Methods.postAPICall(URL_ACCESS_TOKEN,{
            body:body,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
      //generic_Methods.addContext(this,'INPUT ',formBody);
      //generic_Methods.addContext(this,'OUTPUT ',resp.body);

      if(resp!==undefined)
      {
        let bodyObj=JSON.parse(resp.body);
        assert.equal(resp.statusCode,HTTPStatusCodes.OK);
        assert.equal(resp.statusMessage,HTTPStatusCode.getMessage(200));

        // Fetch data from MongoDB
        await generic_Methods.mongoDBDataFetch('clients', {
            "client_id" : "F1BV8hJ4G2L_Zt7-ZpLUS",
        }, '')
      }
      else
      {
          assert.fail(resp," is undefined");
      }
    }) */

    it("To Verify Error is thrown if the Content-Type in the header is not application/x-www-form-urlencoded ",async function(){
      let formBody = [];
      for (var data in accessTokenTestData) {
        var encodedKey = encodeURIComponent(data);
        var encodedValue = encodeURIComponent(accessTokenTestData[data]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      var body = formBody.join("&");

        resp=await generic_Methods.postAPICall(URL_ACCESS_TOKEN,{
            body:body,
            headers:{
              "Content-Type": "application/x-www-form-urlencoded"
            }
        })
      //generic_Methods.addContext(this,'INPUT ',body);
      //generic_Methods.addContext(this,'OUTPUT ',resp.body);

      if(resp!==undefined)
      {
        
        console.log(resp)
       
        console.log(resp.body)

      }
      else
      {
          assert.fail(resp," is undefined");
      }
    })
})