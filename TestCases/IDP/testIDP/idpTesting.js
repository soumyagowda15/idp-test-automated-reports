
const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const assert = require('chai').assert;
const fs = require('fs');
const delay = require('delay');
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const genericMethods = require('../../../genericMethods/generic_Methods');
const configData = require('../../../ConfigurationTestData/config/test_Config');
const dataValidation = require('../../../ConfigurationTestData/Validation/validation');
const dataGeneration = require('../../../ConfigurationTestData/Test-Data/Data-Generation/dataGeneration');
var URL_CREATE_JOB = configData.BASE_URL[configData.environment] + configData.SUB_URL_CREATE_JOB;
var URL_START_DOC_ANALYSIS = configData.BASE_URL[configData.environment] + configData.URL_START_DOC_ANALYSIS;
var URL_GET_JOBS = configData.BASE_URL[configData.environment] + configData.SUB_URL_GET_JOBS;
const createJobTestData = require('../../../ConfigurationTestData/Test-Data/testCreateJob.json');
const uploadDocument = require('../../../ConfigurationTestData/Test-Data/testUploadDocument.json');
const DocumentAnalysis = require('../../../ConfigurationTestData/Test-Data/testStartDocAnalysis.json');
var resp, ACCESS_TOKEN, FILE_ID, JOB_ID;
const dotenv = require('dotenv').config();


describe("Neutrinos Intelligent Document Processing APIs", async function () {
  before(async function () {
    //update testData 
    //let body=dataGeneration.update_AttributeValue(configData.auth,configData.authorization[configData.environment].CLIENT_ID,configData.authorization[configData.environment].CLIENT_SECRET,configData.authorization[configData.environment].GRANT_TYPE);
    let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
    body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
    body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
    // encode testData
    body = await dataGeneration.encodeData(body);
    //Send request to fetch access Token
    resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    let bodyObj = JSON.parse(resp.body);
    ACCESS_TOKEN = bodyObj.access_token;
  })
  describe("Get Access Token", async function () {
     /* it.only("test",async function(){
       console.log(process.env.CLIENT_ID)
     }) */
    it("TC_AC_01->To verify that access Token is genearted when proper client ID (client should be registered to DEV IDP), client Secret, and grant type is provided in the Input for the Get Access Token POST API ", async function () {
      //update testData 
      //let body=dataGeneration.update_AttributeValue(configData.auth,configData.authorization[configData.environment].CLIENT_ID,configData.authorization[configData.environment].CLIENT_SECRET,configData.authorization[configData.environment].GRANT_TYPE);
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);
      //Send request to fetch access Token
      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })

      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      // Assertion for response
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
        ACCESS_TOKEN = bodyObj.access_token;
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_02->To Verify Error is thrown if the Content-Type in the header is not application/x-www-form-urlencoded ", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);
      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(bodyObj.error_description, dataValidation.INVALID_CONTENT_TYPE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_03->To verify error is thrown if client_id and client_secret are not of same client", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET1);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);
      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_04->To verify that error is thrown if the grant_type in the Input body is not client_credentials", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", "grant");
      // encode testData
      body = await dataGeneration.encodeData(body);
      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(bodyObj.error_description, dataValidation.INVALID_GRANT_TYPE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_05->To verify error is thrown if for a client registered in IDP ,client secret is random text in the input body for Get Access Token POST API", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", "clientSecret");
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_06->To verify that error is thrown if the grant_type is null", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", null);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(bodyObj.error_description, dataValidation.INVALID_GRANT_TYPE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_07->To verify that error is thrown if the grant_type is empty", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", "");
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(bodyObj.error_description, dataValidation.MISSING_GRANT_PARAMETER);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_08->To verify error is thrown if client_id is null", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", null);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_09->To verify error is thrown if client_id is empty", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", "");
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(bodyObj.error_description, dataValidation.INVALID_CLIENT);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_10->To verify error is thrown if client_id is empty space", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", " ");
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_11->To verify error is thrown if client_secret is null", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", null);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_12->To verify error is thrown if client_secret is empty", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", "");
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_13->To verify error is thrown if client_secret is empty space", async function () {
      //update testData 
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", " ");
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      // encode testData
      body = await dataGeneration.encodeData(body);

      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      genericMethods.addContext(this, 'INPUT ', body);
      genericMethods.addContext(this, 'OUTPUT ', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.UNAUTHORIZED);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(401));
        assert.equal(bodyObj.error_description, dataValidation.AUTHORIZATION_FAILED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
  })
  describe("Create Job", async function () {

    it("TC_CJ_01->To verify Job is created for a client if the proper tenant and access token is provided in the header for '/JOB' POST API", async function () {
      //testData for createJob
      let body = JSON.stringify(createJobTestData);
      //send Request
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
      // Fetch data for jobs MongoDB table
      var bodyObj = JSON.parse(resp.body);
      jobsMongoData = await genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name });
      genericMethods.addContext(this, 'MongoDb-Jobs', jobsMongoData);
      //assertion for response
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
        JOB_ID = bodyObj[0]._id;
        assert.equal(bodyObj[0].job_type, "doc_analysis");
        assert.exists(bodyObj[0].tenant_id);
        assert.exists(bodyObj[0].job_name);
        assert.exists(bodyObj[0].status);
        assert.equal(bodyObj[0].client_id, configData.authorization[configData.environment].CLIENT_ID);
        assert.exists(bodyObj[0]._id);
      }
      else {
        assert.fail(resp, "is undefined")
      }
    })

    it("TC_CJ_02->To verify job is not created if expired access Token is passed", async function () {
      let body = JSON.stringify(createJobTestData);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.result.active, false);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
    it("TC_CJ_03->To verify that job is not created when client is not registered to DEV IDP", async function () {
      //Generate access token using unregistered client_id and client_secret
      let body = dataGeneration.update_AttributeValue(configData.auth, "client_id", configData.authorization[configData.environment].UNREGISTERED_CLIENT_ID);
      body = dataGeneration.update_AttributeValue(body, "client_secret", configData.authorization[configData.environment].UNREGISTERED_CLIENT_SECRET);
      body = dataGeneration.update_AttributeValue(body, "grant_type", configData.GRANT_TYPE);
      body = await dataGeneration.encodeData(body);
      resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      UNREGISTERED_CLIENT_ACCESS_TOKEN = JSON.parse(resp.body).access_token;
      // create job 
      let createJobbody = JSON.stringify(createJobTestData);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: createJobbody,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${UNREGISTERED_CLIENT_ACCESS_TOKEN}`
        }

      })
      genericMethods.addContext(this, 'INPUT JSON', createJobbody);
      genericMethods.addContext(this, 'OUTPUT JSON', resp);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.message, dataValidation.UNREGISTERED_CLIENT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_CJ_04->To verify error is thrown if tenant is not neutrinos", async function () {
      let body = JSON.stringify(createJobTestData);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "DEV_IDP",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }

      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
      if (resp !== undefined) {
        var bodyObj = JSON.parse(resp.body);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail(resp, "is undefined")
      }
    })
    it("TC_CJ_05->To verify error is thrown if payload is not JSON", async function () {
      let body = "Invalid Payload"
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "text/plain",
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }

      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
      }

    })
    it("TC_AC_06->To verify job is not created if invalid access Token is passed", async function () {
      let body = JSON.stringify(createJobTestData);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer INVALID_ACCESS_TOKEN`
        }
      })
      genericMethods.addContext(this, 'INPUT JSON', body);
      genericMethods.addContext(this, 'OUTPUT JSON', resp);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.result.active, false);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_AC_07->To verify error is thrown if job_type is removed in the json body", async function () {
      let body = dataGeneration.remove_Attribute(createJobTestData, "job_type");
      body = JSON.stringify(body);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "Input", body);
      genericMethods.addContext(this, "Output", resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(bodyObj.message, dataValidation.UNKNOWN_JOB_TYPE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_08->To verify error is thrown if created_by is removed in the json body", async function () {
      let body = dataGeneration.remove_Attribute(createJobTestData, "created_by");
      body = JSON.stringify(body);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "Input", body);
      genericMethods.addContext(this, "Output", resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(bodyObj.message, dataValidation.CREATED_BY_REQUIRED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_09->To verify error is thrown if created_by is empty value in the json body", async function () {
      let body = dataGeneration.update_AttributeValue(createJobTestData, "created_by", "");
      body = JSON.stringify(body);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "Input", body);
      genericMethods.addContext(this, "Output", resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(bodyObj.message, dataValidation.CREATED_BY_REQUIRED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_AC_10->To verify error is thrown if created_by is empty space value in the json body", async function () {
      let body = dataGeneration.update_AttributeValue(createJobTestData, "created_by", " ");
      body = JSON.stringify(body);
      resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "Input", body);
      genericMethods.addContext(this, "Output", resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(bodyObj.message, dataValidation.UNKNOWN_JOB_TYPE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    // Test cases related to job_type is pending-- job is created when job_type is empty
  })
  describe("Upload Document to a Job", async function () {
    it("TC_UD_01->To verify user is able to uplaod pdf document successfully with job_id", async function () {
      // request to upload Document
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      // files.files MongoDB Data
      let uploadDocMongoData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
      genericMethods.addContext(this, 'Upload Document', uploadDocMongoData)
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        assert.exists(resp.body["_id"]);
        FILE_ID = resp.body["_id"];
        // assertion for other fields are pending

      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_02->To verify user is able to upload multiple documnets to same job_id", async function () {
      // request to upload Document one more document to same job_id
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      // files.files MongoDB Data
      let uploadDocMongoData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
      genericMethods.addContext(this, 'Upload Document', uploadDocMongoData)
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        assert.exists(resp.body["_id"]);
        // assertion for other fields are pending

      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })

    it("TC_UD_03->To verify only pdf format documnet is supported", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/pancard.png`), `pancard.png`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
        assert.equal(resp.body.message.message, dataValidation.INVALID_PDF_STRUCTURE);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_04->To verify error is thrown if the job_id sent in the request body is not present in the jobs mongoDB Collections", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', "Invalid Job_id");

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.JOB_ID_REQUIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_05->To Verify Error is thrown if the content-type in the request is not multipart/form-data", async function () {
      var URL_UPLOAD_DOCUMENT = configData.BASE_URL[configData.environment] + configData.SUB_URL_UPLOAD_DOCUMENT;
      let body = dataGeneration.update_AttributeValue(uploadDocument, "job_id", JOB_ID);
      body = JSON.stringify(body);
      resp = await genericMethods.postApiCall(URL_UPLOAD_DOCUMENT, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(bodyObj.message, dataValidation.CONTENT_TYPE_INVALID);
      }
      else {
        assert.fail(resp, " Response is undefined");
      }
    })

    it("TC_UD_06->To Verify user is not able to upload the document if expired access Token is passed in the header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.body.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_07->To Verify user is not able to upload the document if Invalid access Token is passed in the header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', "INVALID_ACCESS_TOKEN")
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.body.result.reason, dataValidation.TOKEN_UNAVAILABLE);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_UD_08->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'IDP_DEV')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.body.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_09->To verify error is thrown if empty tenant is passed in the header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', ' ')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.body.result.reason, dataValidation.TENANT_MISSING);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_10->To verify error is thrown if empty access token is passed in the header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', ' ')
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID);

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.body.result.reason, dataValidation.TOKEN_UNAVAILABLE);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_UD_11->To verify error is thrown if document is not uploaded in request body", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', '')
        .field('job_id', JOB_ID);

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.INVALID_FILE_FORMAT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_UD_12->To verify error is thrown if job_id is removed in the request body", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)


      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.JOB_ID_REQUIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_UD_13->To verify error is thron if files field is removed in the header", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .field('job_id', JOB_ID)

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.INVALID_FILE_FORMAT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_UD_14->To verify error is thrown if job_id is empty", async function () {
      chai.use(chaiHttp);
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', " ")

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.JOB_ID_REQUIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_UD_15->To verify error is thrown if job_id is empty space", async function () {
      var resp = await chai.request(configData.BASE_URL[configData.environment]).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', " ")

      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.status, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body.message, dataValidation.JOB_ID_REQUIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

  })
  describe("Start Document Analysis", async function () {
    it("TC_SDA_01->To verify Document is processed successfully if access_token , tenant is passed in the request header and job_id in body for '/api/job/start-doc-analysis' POST API", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", JOB_ID);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      }
      else {
        assert.fail(resp, " Response is undefined");
      }
    })
    it("TC_SDA_02->To verify error is thrown if invalid job_id is passed in the request body for '/api/job/start-doc-analysis' POST API", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", configData.INVALID_JOB_ID);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_START_DOC);
      }
      else {
        assert.fail("resp is undefined", resp)
      }
    })
    it("TC_SDA_03->To verify Document is not processed if expired access token is passed", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", JOB_ID);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      let bodyObj = JSON.parse(resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail("resp is undefined", resp)
      }
    })
    it("TC_SDA_04->To Verify user is not able to upload the document if Invalid access Token is passed in the header", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", JOB_ID);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail("resp is undefined", resp)
      }
    })
    it("TC_SDA_05->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", JOB_ID);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": "IDP_DEV",
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail("resp is undefined", resp)
      }
    })
    it("TC_SDA_06->To verify error is thrown if payload is not JSON", async function () {
      let body = "Invalid Payload";
      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: body,
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "text/plain"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_SDA_07->To verify error is thrown if job_id is empty", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", "");

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      // issue created
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
      }
      else {
        assert.fail("resp is undefined", resp)
      }
    })
    it("TC_SDA_08->To verify error is thrown if job_id is removed in the request body", async function () {
      let body = dataGeneration.remove_Attribute(DocumentAnalysis, "job_id");

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_START_DOC);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_SDA_09->To verify error is thrown if for the given job_id documents are not uploaded ", async function () {
      let body = dataGeneration.update_AttributeValue(DocumentAnalysis, "job_id", configData.authorization[configData.environment].JOB_ID_DOCUMENT_NOT_UPLOADED);

      var resp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      genericMethods.addContext(this, 'INPUT', body);
      genericMethods.addContext(this, 'OUTPUT', resp);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, "Sorry no files to extract");
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })

  })
  describe("Get Job Documents", async function () {

    it("TC_JD_01->To verify that user is able to get job documentt with job_id", async function () {
      URL_GET_JOB_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/documents`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      FilesDataFetch = true, FilesDataCount = 0;
      // 5s once we are checking the status of the file. max time we wait for record to be DONE is 240s.
      do {
        var filesMongoData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }));
        if (filesMongoData !== undefined && filesMongoData.length > 0) {
          if (filesMongoData[0].metadata.status == "DONE") {
            FilesDataFetch = false;
          }
          else if (FilesDataCount >= 48) {
            FilesDataFetch = false;
          }
          else {
            FilesDataCount++;
            await delay(5000);
          }
        }
        else {
          assert.fail(filesMongoData, "MongoDB Data Fetch is undefined");
        }
      } while (FilesDataFetch);

      genericMethods.addContext(this, 'files.files MongoDBData'.filesMongoData);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        var bodyObj = JSON.parse(resp.body);
        assert.exists(bodyObj[0]["_id"]);
        assert.equal(bodyObj[0]["metadata"]["job_id"], JOB_ID);
      }
      else {
        assert.fail("Response is undefined", resp);
      }

    })
    it("TC_JD_02->To verify documentt is not fetched when invalid job_id is  provided in the queryparamter", async function () {
      URL_GET_JOB_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/documents`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
      }
      else {
        assert.fail(resp, " is undefined");
      }
      //issue created

    })
    it("TC_JD_03->To Verify user is not able to get job document if Invalid access Token is passed in the header", async function () {
      URL_GET_JOB_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/documents`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer Invalid_access_token`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      let bodyObj = JSON.parse(resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_JD_04->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      URL_GET_JOB_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/documents`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
        headers:
        {
          "tenant": "DEV_IDP",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })

    it("TC_JD_05->To verify error is thrown if user provides a job_id for which document is not uploaded", async function () {
      URL_GET_JOB_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${configData.authorization[configData.environment].JOB_ID_DOCUMENT_NOT_UPLOADED}/documents`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + configData.authorization[configData.environment].JOB_ID_DOCUMENT_NOT_UPLOADED);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        assert.fail();// created issue to provide message- Document doesn't exists
      }
      else {
        assert.fail(resp, " is undefined");
      }
      //issue created
    })

  })
  describe("Get Document Result", async function () {

    it("TC_GDR_01->To verify that user is able to get the document result of the uploaded pdf document", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      var EngineResultsMongoData = (await genericMethods.mongoDBDataFetch("transformed_engine_result", { "job_id": JOB_ID }));
      genericMethods.addContext(this, 'Transformed Engine Results', EngineResultsMongoData)

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        let bodyObj = JSON.parse(resp.body);
        assert.exists(bodyObj[0]["_id"]);
        assert.equal(bodyObj[0]["file_id"], FILE_ID);
        assert.equal(bodyObj[0]["job_id"], JOB_ID);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })
    it("TC_GDR_02->To verify error is thrown if invalid job_id and file_id is provided", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/file/${configData.authorization[configData.environment].INVALID_FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_ENGINE_RESULT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })

    it("TC_GDR_03->To verify error is thrown if file_id of different job is provided in the query parameter", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${configData.authorization[configData.environment].INVALID_FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.FILE_ID_REQUIRED_ENGINE_RESULT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })

    it("TC_GDR_04->To verify error is thrown if job_id is invalid", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_ENGINE_RESULT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })

    it("TC_GDR_05->To verify error is thrown if file_id is invalid", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${configData.INVALID_FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.FILE_ID_REQUIRED_ENGINE_RESULT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })
    it("TC_GDR_06->To Verify user is not able to upload the document if expired access Token is passed in the header", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      let bodyObj = JSON.parse(resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_GDR_07->To Verify user is not able to upload the document if Invalid access Token is passed in the header", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`
      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer invalid_access_token`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_GDR_08->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": "DEV_IDP",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      let bodyObj = JSON.parse(resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);

      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_GDR_09->To verify error is thrown if job_id is empty", async function () {
      let JOB_ID = "";
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
    it("TC_GDR_10->To verify error is thrown if file_id is empty", async function () {
      let FILE_ID = "";
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_GDR_11->To verify error is thrown if the document status is not DONE", async function () {
      let FILE_ID = "63f2264c3a209100191491ad", JOB_ID = "63f2264a3a209100191491ab";
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "File_id: " + FILE_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(resp.body, dataValidation.JOB_ID_DOESNOT_EXISTS);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_GDR_12->To verify error is thrown if Job , Document Analysis is not done", async function () {
      let JOB_ID = "63f493443a20910019149a79", FILE_ID = "63f4935d3a20910019149a7b";
      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "File_id: " + FILE_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(resp.body, dataValidation.FILE_ID_DOESNOT_EXISTS);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })

    it("TC_GDR_13->To verify error is thrown if job_id removed in URL", async function () {

      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/file/${FILE_ID}/result`
      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_GDR_14->To verify error is thrown if file_id is removed in URL", async function () {

      let URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/result`;

      resp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
        assert.equal(resp.body, dataValidation.FILE_ID_REQUIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })
  })
  describe("Get Document", async function () {
    it("TC_GD_01->To verify user is able to get document using valid job_id and file_id", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })
    it("TC_GD_02->To verify error is thrown if invalid job_id and file_id is provided", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/file/${configData.INVALID_FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_GET_DOCUMENT)
      }
    })
    it("TC_GD_03->To verify error is thrown if file_id of different job is provided in the query parameter", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${configData.authorization[configData.environment].INVALID_FILE_ID}`

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.FILE_ID_REQUIRED);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })

    it("TC_GD_04->To verify error is thrown if job_id is invalid", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${configData.INVALID_JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      genericMethods.addContext(this, 'OUTPUT', resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_GET_DOCUMENT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })

    it("TC_GD_05->To verify error is thrown if file_id is invalid", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${configData.INVALID_FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      genericMethods.addContext(this, 'Response', resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.FILE_ID_REQUIRED);
      }
      else {
        assert.fail("Response is undefined", resp);
      }
    })
    it("TC_GD_06->To verify error is thrown if job_id is empty", async function () {
      let JOB_ID = "";
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail(resp, " Resopnse is undefined");
      }
    })

    it("TC_GD_07->To verify error is thrown if file_id is empty", async function () {
      let FILE_ID = "";
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }

    })
    it("TC_GD_08->To verify error is thrown if job_id is empty space", async function () {
      let JOB_ID = " ";
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
        assert.equal(resp.body, dataValidation.JOB_ID_REQUIRED_GET_DOCUMENT);
      }
      else {
        assert.fail("Response is undefined", resp);
      }

    })
    it("TC_GD_09->To verify error is thrown if file_id is empty space", async function () {
      let FILE_ID = " ";
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
        assert.equal(resp.body, dataValidation.INVALID_ENDPOINT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
    it("TC_GD_10->To verify error is thrown if expired access token is passed", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`
        }
      })
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_GD_10->To verify error is thrown if invalid access token is passed", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;
      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer invalid_Access_token`
        }
      })
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
    it("TC_GD_11->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": "DEV_IDP",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
    it("TC_GD_12->To verify error is thrown if the tenant is null in the request header", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": null,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TENANT_MISSING);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
    it("TC_GD_13->To verify error is thrown if  access token is null", async function () {
      let URL_GET_DOCUMENT = configData.BASE_URL[configData.environment] + `/api/job/${JOB_ID}/file/${FILE_ID}`;

      resp = await genericMethods.getApiCall(URL_GET_DOCUMENT, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": null
        }
      })

      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_UNAVAILABLE);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }

    })
  })
  describe("Get Jobs", async function () {

    it("TC_GJ_01->To verify that all the jobs with respect to the given tenant are fetched", async function () {

      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "output", resp.body);

      getJobsMongoData = await genericMethods.mongoDBDataFetch("jobs", { "tenant_id": `${configData.NEUTRINOS_TENANT_ID}` });
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.length, getJobsMongoData.length);
      }
      else {
        assert.fail(resp, "Response is undefined");
      }
    })

    it("TC_GJ_02->To verify error is thrown if expired access token is passed", async function () {

      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `Bearer ${configData.authorization[configData.environment].EXPIRED_ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "output", resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_EXPIRED);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_GJ_03->To verify error is thrown if invalid access token is passed", async function () {
      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": `invalid_access_token`
        }
      })
      genericMethods.addContext(this, "output", resp.body);
      let bodyObj = JSON.parse(resp.body);

      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_UNAVAILABLE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_GJ_04->To verify error is thrown if the tenant is not neutrinos in the request header", async function () {
      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": "DEV_IDP",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "output", resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.message, dataValidation.INVALID_TENANT);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_GJ_05->To verify error is thrown if the tenant is not neutrinos is null", async function () {
      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": null,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      genericMethods.addContext(this, "output", resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.result.reason, dataValidation.TENANT_MISSING);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("TC_GJ_06->To verify error is thrown if access token is null", async function () {
      resp = await genericMethods.postApiCall(URL_GET_JOBS, {
        headers:
        {
          "tenant": configData.TENANT,
          "Authorization": null
        }
      })
      genericMethods.addContext(this, "output", resp.body);
      if (resp !== undefined) {
        assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj.result.reason, dataValidation.TOKEN_UNAVAILABLE);
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
  })
})