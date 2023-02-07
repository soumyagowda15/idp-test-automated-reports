const assert = require('chai').assert;
const delay=require('delay');
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const accessTokenTestData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json');
const genericMethods = require('../../../generic-Methods/generic_Methods')
const configData = require('../../../Configuration-Test_Data/config/test_Config')
const URL_ACCESS_TOKEN = "https://ids.neutrinos.co/token";
const dataValidation = require('../../../Configuration-Test_Data/Validation/validation');
const dataGeneration = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration')
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB;
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS
const createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json');
const uploadDocument = require('../../../Configuration-Test_Data/Test-Data/testUploadDocument.json');
const DocumentAnalysis=require('../../../Configuration-Test_Data/Test-Data/testStartDocAnalysis.json');
const validation = require('../../../Configuration-Test_Data/Validation/validation');
var resp, ACCESS_TOKEN;
const chai = require("chai");
const expect = require("chai").expect;
const fs = require('fs')
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
describe("Neutrinos Intelligent Document Processing APIs",async function(){
  
describe("Get Access Token", async function () {

  it("TC_AC_01->To verify that access Token is genearted when proper client ID (client should be registered to DEV IDP), client Secret, and grant type is provided in the Input for the Get Access Token POST API ", async function () {
    let body = dataGeneration.update_AttributeValue(JSON.stringify(accessTokenTestData), "client_id", configData.CLIENT_ID);
    body = dataGeneration.update_AttributeValue(body, "client_secret", configData.CLIENT_SECRET);
    let formBody = [];
    for (var data in accessTokenTestData) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(accessTokenTestData[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    genericMethods.addContext(this, 'INPUT ', formBody);
    genericMethods.addContext(this, 'OUTPUT ', resp.body);

    if (resp !== undefined) {
      let bodyObj = JSON.parse(resp.body);
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
      ACCESS_TOKEN = bodyObj.access_token;
      /* // Fetch data from MongoDB
      await genericMethods.mongoDBDataFetch('clients', {
        "client_id": "F1BV8hJ4G2L_Zt7-ZpLUS",
      }, '') */
    }
    else {
      assert.fail(resp, " is undefined");
    }
  })

  it("TC_AC_02->To Verify Error is thrown if the Content-Type in the header is not application/x-www-form-urlencoded ", async function () {
    let formBody = [];
    for (var data in accessTokenTestData) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(accessTokenTestData[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    var body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
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
    //body=dataGeneration.update_AttributeValue(accessTokenTestData,"client_secret",configData.CLIENT_SECRET1);
    let body = dataGeneration.update_AttributeValue(JSON.stringify(accessTokenTestData), "client_id", configData.CLIENT_ID1);
    body = JSON.parse(body);
    let formBody = [];
    for (var data in body) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(body[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
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
    var body = dataGeneration.update_AttributeValue(JSON.stringify(accessTokenTestData), "grant_type", "grant");
    body = JSON.parse(body)
    let formBody = [];
    for (var data in body) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(body[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    var body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
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
    //body=dataGeneration.update_AttributeValue(accessTokenTestData,"client_secret",configData.CLIENT_SECRET1);
    let body = dataGeneration.update_AttributeValue(JSON.stringify(accessTokenTestData), "client_secret", "clientsecret");
    body = JSON.parse(body);
    let formBody = [];
    for (var data in body) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(body[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
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
    let body = JSON.stringify(createJobTestData);
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "tenant": "neutrinos",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }

    })
    genericMethods.addContext(this, 'INPUT JSON', body);
    genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
    if (resp !== undefined) {
      var bodyObj = JSON.parse(resp.body);
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
      JOB_ID = bodyObj[0]._id;
      assert.equal(bodyObj[0].job_type, "doc_analysis");
      assert.exists(bodyObj[0].tenant_id);
      assert.exists(bodyObj[0].job_name);
      assert.exists(bodyObj[0].status);
      assert.equal(bodyObj[0].client_id, configData.CLIENT_ID);
      assert.exists(bodyObj[0]._id);

    }
    else {
      assert.fail(resp, "is undefined")
    }
  })
  it("TC_CJ_02->To verify job is not created if expired access Token is passed", async function () {
    let body = JSON.stringify(createJobTestData);
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "tenant": "neutrinos",
        "Authorization": `Bearer ${configData.EXPIRED_ACCESS_TOKEN}`
      }

    })
    genericMethods.addContext(this, 'INPUT JSON', body);
    genericMethods.addContext(this, 'OUTPUT JSON', resp);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
      let bodyObj = JSON.parse(resp.body);
      assert.equal(bodyObj.result.active, false);
      assert.equal(bodyObj.result.reason, validation.TOKEN_EXPIRED);
    }
    else {
      assert.fail(resp, "is undefined");
    }

  })
  it("TC_CJ_03->To verify that job is not created when client is not registered to DEV IDP", async function () {
    let body = dataGeneration.update_AttributeValue(JSON.stringify(accessTokenTestData), "client_id", configData.UNREGISTERED_CLIENT_ID);
    body = dataGeneration.update_AttributeValue(body, "client_secret", configData.UNREGISTERED_CLIENT_SECRET);
    body = JSON.parse(body);
    let formBody = [];
    for (var data in body) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(body[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    body = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    UNREGISTERED_CLIENT_ACCESS_TOKEN = JSON.parse(resp.body).access_token;
    let createJobbody = JSON.stringify(createJobTestData);
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
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
      assert.equal(bodyObj.message, validation.UNREGISTERED_CLIENT);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_CJ_04->To verify error is thrown if tenant is not neutrinos", async function () {
    let body = JSON.stringify(createJobTestData);
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
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
      assert.equal(bodyObj.message, validation.INVALID_TENANT);
    }
    else {
      assert.fail(resp, "is undefined")
    }
  })
  it.skip("TC_CJ_05->To verify error is thrown if payload is not JSON", async function () {
    let body = "Invalid Payload"
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "tenant": "DEV_IDP",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }

    })
    genericMethods.addContext(this, 'INPUT JSON', body);
    genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
  })
  it("TC_AC_06->To verify job is not created if invalid access Token is passed", async function () {
    let body = JSON.stringify(createJobTestData);
    resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
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
      assert.equal(bodyObj.result.reason, validation.TOKEN_EXPIRED);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
})
describe("Upload Document to a Job", async function () {
  it("TC_UD_01->To verify user is able to uplaod pdf document successfully with job_id", async function () {
    chai.use(chaiHttp);
    /* JOB_ID= "63e1dd7513f5a0003b8d3900"
    ACCESS_TOKEN="cZnQUIybh-2IvWwqyhK5N9mSDr3Qm9ZuGshGU6RgK-b" */
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    //let uploadDocData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      assert.exists(resp.body["_id"]);
      // assertion for other fields are pending

    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_02->To verify user is able to upload multiple documnets to same job_id", async function () {
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)
    genericMethods.addContext(this, 'OUTPUT', resp.body);

  })

  it("TC_UD_03->To verify only pdf format documnet is supported", async function () {
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/pancard.png`), `pancard.png`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = resp.body
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      assert.equal(bodyObj.message.message, dataValidation.INVALID_PDF_STRUCTURE);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_04->To verify error is thrown if the job_id sent in the request body is not present in the jobs mongoDB Collections", async function () {
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', "Invalid Job_id")

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCode.BAD_REQUEST);
      //message pending
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_05->To Verify Error is thrown if the content-type in the request is not multipart/form-data", async function () {
    var URL_UPLOAD_DOCUMENT = configData.BASE_URL + ' /api/job/documents/upload';
    let body = dataGeneration.update_AttributeValue(JSON.stringify(uploadDocument), "job_id", "638f2bcd9ed076003b9cd7dc");
    resp = await genericMethods.postAPICall(URL_UPLOAD_DOCUMENT, {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "tenant": "neutrinos",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }

    })

    genericMethods.addContext(this, 'OUTPUT', resp.body);

    // Created issue, need to be fixed
  })

  it("TC_UD_06->To Verify user is not able to upload the document if expired access Token is passed in the header", async function () {
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${configData.EXPIRED_ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason, validation.TOKEN_EXPIRED);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_07->To Verify user is not able to upload the document if Invalid access Token is passed in the header",async function(){
    chai.use(chaiHttp);
    JOB_ID= "63e1dd7513f5a0003b8d3900"
    ACCESS_TOKEN="cZnQUIybh-2IvWwqyhK5N9mSDr3Qm9ZuGshGU6RgK-b"
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', "INVALID_ACCESS_TOKEN")
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason, validation.TOKEN_UNAVAILABLE);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_08->To verify error is thrown if the tenant is not neutrinos in the request header",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'IDP_DEV')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
     // assert.equal(bodyObj.result.reason, validation.INVALID_TENANT);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_09->To verify error is thrown if empty tenant is passed in the header",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', ' ')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason, validation.TENANT_MISSING);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })

  it("TC_UD_10->To verify error is thrown if empty access token is passed in the header",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', ' ')
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason, validation.TOKEN_UNAVAILABLE);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_11->To verify error is thrown if document is not uploaded in request body",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      //.attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_12->To verify error is thrown if job_id is removed in the request body",async function()
  {
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //Issue created
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_13->To verify error is thron if files field is removed in the header",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .field('job_id', JOB_ID)

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_14->To verify error is thrown if job_id is empty",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id'," ")

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    console.log(bodyObj)
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_UD_15->To verify error is thrown if job_id is empty space",async function(){
    chai.use(chaiHttp);
    const api = chai.request(configData.BASE_URL)
    var resp = await api.post("/api/job/documents/upload")
      .set('Content-Type', 'multipart/form-data')
      .set('tenant', 'neutrinos')
      .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
      .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
      .field('job_id'," ")

    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj = (resp.body);
    if (resp !== undefined) {
      assert.equal(resp.status, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created--document is uploaded
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
})
describe("Start Document Analysis",async function(){
  it("TC_SDA_01->To verify Document is processed successfully if access_token , tenant is passed in the request header and job_id in body for '/api/job/start-doc-analysis' POST API",async function(){
    let body = dataGenerator.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", JOB_ID);
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
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
      assert.fail("resp is undefined", resp)
    }
  })
  it("TC_SDA_02->To verify error is thrown if invalid job_id is passed in the request body for '/api/job/start-doc-analysis' POST API",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "Invalid_job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer y2yeiL1ieF1xWIkWMj6ywhWZIAvzxXcSYcLCUcSdarU`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created
    }
    else {
      assert.fail("resp is undefined", resp)
    }
  })
  it("TC_SDA_03->To verify Document is not processed if expired access token is passed",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "Invalid_job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${configData.EXPIRED_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj=JSON.parse(resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason,validation.TOKEN_EXPIRED);
    }
    else {
      assert.fail("resp is undefined", resp)
    }
  })
  it("TC_SDA_04->To Verify user is not able to upload the document if Invalid access Token is passed in the header",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "Invalid_job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${configData.EXPIRED_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj=JSON.parse(resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason,validation.TOKEN_EXPIRED);
    }
    else {
      assert.fail("resp is undefined", resp)
    }
  })
  it("TC_SDA_05->To verify error is thrown if the tenant is not neutrinos in the request header",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "Invalid_job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": "IDP_DEV",
        "Authorization": `Bearer cIwRL8t79wJPwyQc12k6qFX58loXrjX4fdoweNTJ-DA`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    let bodyObj=JSON.parse(resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.message,validation.INVALID_TENANT);
    }
    else {
      assert.fail("resp is undefined", resp)
    }
  })
  it.skip("TC_SDA_06->To verify error is thrown if payload is not JSON",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "Invalid_job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": "IDP_DEV",
        "Authorization": `Bearer y2yeiL1ieF1xWIkWMj6ywhWZIAvzxXcSYcLCUcSdarU`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
  })
  it("TC_SDA_07->To verify error is thrown if job_id is empty",async function(){
    let body = dataGeneration.update_AttributeValue(JSON.stringify(DocumentAnalysis), "job_id", "");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer cIwRL8t79wJPwyQc12k6qFX58loXrjX4fdoweNTJ-DA`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    // issue created
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.INTERNAL_SERVER_ERROR);
    }
    else {
      assert.fail("resp is undefined", resp)
    }
  })
  it("TC_SDA_08->To verify error is thrown if job_id is removed in the request body",async function()
  {
    let body=dataGeneration.remove_Attribute(JSON.stringify(DocumentAnalysis),"job_id");
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer cIwRL8t79wJPwyQc12k6qFX58loXrjX4fdoweNTJ-DA`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.INTERNAL_SERVER_ERROR);
      //issue created
    }
    else
    {
      assert.fail(resp," is undefined");
    }
  })
  it("TC_SDA_09->To verify error is thrown if for the given job_id documents are not uploaded ",async function(){
    //Issue created
  })
  
})
describe("Get Job Documents",async function(){
  it("TC_JD_01->To verify that user is able to get job documnet with job_id",async function(){
    let SUB_URL_GET_JOB_DOCUMENT=`/api/job/${JOB_ID}/documents`;
    URL_GET_JOB_DOCUMENT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT;
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.OK);
      let bodyObj=JSON.parse(resp.body);
      assert.exists(bodyObj[0]["_id"]);
      console.log("REsponse is",bodyObj[0])
      assert.equal(bodyObj[0]["metadata"]["job_id"],JOB_ID)
      if(bodyObj[0]["metadata"]["job_id"]!=="DONE")
      {
        await delay(600000);
      }
    }

    else
    {
      assert.fail(" Response is undefined",resp);
    }
    
  })
  it("TC_JD_02->To verify documnet is not fetched when invalid job_id is  provided in the queryparamter",async function(){
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    //issue created
    
  })
  it("TC_JD_03->To Verify user is not able to get job document if Invalid access Token is passed in the header",async function(){
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer Invalid_access_token`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    let bodyObj=JSON.parse(resp.body);
    if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.result.reason,validation.TOKEN_EXPIRED);
    }
    else
    {
      assert.fail(resp," is undefined");
    }
  })
  it("TC_JD_04->To verify error is thrown if the tenant is not neutrinos in the request header",async function(){
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT,{
      headers:
      {
        "tenant":"DEV_IDP",
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
   // console.log(resp.body)
    let bodyObj =resp.body;
    if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.FORBIDDEN);
      assert.equal(bodyObj.message,validation.INVALID_TENANT);
    }
    else
    {
      assert.fail(resp," is undefined");
    }
  })
  it("TC_JD_05->To verify error is thrown if user provides a job_id for which document is not uploaded",async function(){
    //issue created
  })
})
describe("Get Document Result",async function(){

  it("TC_GDR_01->To verify that user is able to get the document result of the uploaded pdf document",async function(){
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.OK);
      let bodyObj=JSON.parse(resp.body);
      assert.exists(bodyObj[0]["_id"]);
      assert.equal(bodyObj[0]["file_id"],FILE_ID);
      assert.equal(bodyObj[0]["job_id"],JOB_ID);
    }
    else
    {
      assert.fail("Response is undefined",resp);
    }
  })
  it("TC_GDR_02->To verify error is thrown if invalid job_id and file_id is provided",async function(){
    //Issue Created
  })
  it("TC_GDR_03->To verify error is thrown if file_id of different job is provided in the query parameter",async function(){
    //issue created
  })
  it("TC_GDR_04->To verify error is thrown if job_id is invalid",async function(){
//Issue Created
  })
  it("TC_GDR_05->To verify error is thrown if file_id is invalid",async function(){
    //Issue Created
  })
  it("TC_GDR_06->To Verify user is not able to upload the document if expired access Token is passed in the header",async function(){
    JOB_ID="63bfe13e3c141d0032bf46c4"
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${configData.EXPIRED_ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
      let bodyObj = (resp.body);
      //assert message
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_07->To Verify user is not able to upload the document if Invalid access Token is passed in the header",async function(){
    JOB_ID="63bfe13e3c141d0032bf46c4"
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer invalid_access_token`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
      let bodyObj = (resp.body);
      //assert message
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_08->To verify error is thrown if the tenant is not neutrinos in the request header",async function(){
    JOB_ID="63bfe13e3c141d0032bf46c4"
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":"DEV_IDP",
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.FORBIDDEN);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(403));
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_09->To verify error is thrown if job_id is empty",async function(){
    JOB_ID=" "
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    console.log(resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
      assert.equal(resp.body,validation.INVALID_ENDPOINT);
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_10->To verify error is thrown if file_id is empty",async function(){
    JOB_ID="63bfe13e3c141d0032bf46c4"
    FILE_ID=" "
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    console.log(resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
      assert.equal(resp.body,validation.INVALID_ENDPOINT);
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_11->To verify error is thrown if the document status is not DONE",async function(){
    //Issue created
    JOB_ID="63d3a8763bf502001907ba2a"
    FILE_ID="63d3a8d93bf502001907ba36"
    ACCESS_TOKEN="RhkEWU3m1JcleKjKKBhN7JMT5PStPGq4YYGHE9d4K4R"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    console.log(resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.BAD_REQUEST);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(400));
      assert.equal(resp.body,validation.INVALID_ENDPOINT);
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_12->To verify error is thrown if Job , Document Analysis is not done",async function(){
    //Created Issue
  })
  it("TC_GDR_13->To verify error is thrown if job_id removed in URL",async function(){
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/file/${FILE_ID}/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    console.log(resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
      assert.equal(resp.body,validation.INVALID_ENDPOINT);
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
  it("TC_GDR_14->To verify error is thrown if file_id is removed in URL",async function(){
    JOB_ID="63bfe13e3c141d0032bf46c4"
    let SUB_URL_GET_JOB_DOCUMENT_RESULT=`/api/job/${JOB_ID}/file/result`
    URL_GET_JOB_DOCUMENT_RESULT=configData.BASE_URL+SUB_URL_GET_JOB_DOCUMENT_RESULT
    console.log(URL_GET_JOB_DOCUMENT_RESULT)
    resp= await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID);
    genericMethods.addContext(this,'OUTPUT',resp.body);
    console.log(resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.NOT_FOUND);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(404));
      assert.equal(resp.body,validation.INVALID_ENDPOINT);
      //assert message
      let bodyObj = (resp.body);
    }
    else {
      assert.fail(resp, "is undefined");
    }
  })
})
describe("Get Document",async function(){
  it("TC_GD_01->To verify user is able to get document using valid job_id and file_id",async function(){
     JOB_ID="63bfe13e3c141d0032bf46c4"
    ACCESS_TOKEN="om3sVzVGGv1Q-zd5mN8U__0Jj2r6HB1nGh4DdpAh0jd"
    FILE_ID="63bfe1693c141d0032bf46c6"
    let SUB_URL_GET_DOCUMENT=`/api/job/${JOB_ID}/file/${FILE_ID}`
    URL_GET_DOCUMENT=configData.BASE_URL+SUB_URL_GET_DOCUMENT
    console.log(URL_GET_DOCUMENT)
    resp= await genericMethods.getAPICall(URL_GET_DOCUMENT,{
      headers:
      {
        "tenant":configData.TENANT,
        "Authorization":`Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this,'INPUT',"job_id:"+JOB_ID +"  file_id:"+FILE_ID);
   // genericMethods.addContext(this,'OUTPUT',resp);
   console.log(resp.body)
   if(resp!==undefined)
    {
      assert.equal(resp.statusCode,HTTPStatusCodes.OK);
    }
    else
    {
      assert.fail("Response is undefined",resp);
    }
  })

  //API not working
})
})