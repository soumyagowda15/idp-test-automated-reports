import { TestEngineResult } from '../../E2E/testE2E/documentProcessing'
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs')
const delay = require('delay');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
const csv = require('csvtojson')
//const csvFilePath = '../../../CsvFiles/testData/comparision.csv'
const csvFilePath = 'comparision.csv'
import * as Mocha from 'mocha'
//chai.use(chaiHttp);
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json')
const createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json')
const startDocTestData = require('../../../Configuration-Test_Data/Test-Data/testStartDocAnalysis.json')
const genericMethods = require('../../../generic-Methods/generic_Methods');
const dataGenerator = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration')
const configData = require('../../../Configuration-Test_Data/config/test_Config');
const { mongoDBDataFetch } = require('../../../generic-Methods/generic_Methods');
//const comparisionFile = require("../../../Configuration-Test_Data/config/comparisionData/comparision.json");
const { count } = require('console');
const URL_ACCESS_TOKEN = configData.URL
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS
var ACCESS_TOKEN: string, JOB_ID: string, FILE_ID: string;
var document_label: string;
import addContext = require('mochawesome/addContext');
import { TestContext } from 'mochawesome/addContext';
/* async function DocumentResult()
{ */
describe("test", async function () {

  it("Get an access token", async  () => {
    let formBody = [];
    for (var data in testData) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(testData[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    var body = formBody.join("&");

    let resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    //genericMethods.addContext(this, 'INPUT ', formBody);
    //genericMethods.addContext(this, 'OUTPUT ', resp.body);

    if (resp !== undefined) {
      let bodyObj = JSON.parse(resp.body);
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
      assert.exists(bodyObj.access_token);
      assert.exists(bodyObj.expires_in)
      assert.equal(bodyObj.token_type, 'Bearer');
      ACCESS_TOKEN = bodyObj.access_token;
    }
    else {
      assert.fail(resp, " is undefined");
    }
  })
  it("Create a Job", async  () => {
    let body = JSON.stringify(createJobTestData);
    let resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "tenant": "neutrinos",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }

    })
    //genericMethods.addContext(this, 'INPUT JSON', body);
    //genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
    if (resp !== undefined) {
      let bodyObj = JSON.parse(resp.body);
      assert.equal(bodyObj[0].job_type, "doc_analysis");
      assert.equal(bodyObj[0].status, "CREATED");
      assert.exists(bodyObj[0]._id)
      JOB_ID = bodyObj[0]._id
      let createJobData = (await genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name }, ''));
      console.log("mongo Data", createJobData)
      //genericMethods.addContext(this, 'JOBS MongoDB Data', createJobData);
    }
    else {
      assert.fail(resp, "is undefined")
    }
  })
  it("Upload Document to the Job", async function () {

    /* JOB_ID="63bfea463c141d0032bf470a"
    ACCESS_TOKEN="vR8HWdzi_Zf3iTpRfFCGjkWEzndffLuecUcD453nVpr" */
    if (JOB_ID !== undefined || JOB_ID !== null) {
      const Documentlength = fs.readdirSync('../../../Attachment/Passport').length
      console.log("length", Documentlength);
      chai.use(chaiHttp);
      const api = chai.request(configData.BASE_URL)
      var resp = await api.post("/api/job/documents/upload")
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
        .field('job_id', JOB_ID)
      //genericMethods.addContext(this, 'OUTPUT', resp.body);
      let uploadDocData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
      console.log("mongo Data", uploadDocData)
      //genericMethods.addContext(this, `files.files MongoDB Data`, uploadDocData);
      if (resp !== undefined) {
        // let bodyObj = JSON.parse(resp.body);

        //  assert.equal(resp.statusCode, HTTPStatusCodes.OK);

        assert.exists(resp.body._id);
        console.log(resp.body._id)
        FILE_ID = resp.body._id
        console.log("FILE_ID", FILE_ID)
      }
      else {
        assert.fail(resp, " response is undefined")
      }
    }
    else {
      assert.fail(JOB_ID, "JOB ID is undefined/Null")
    }
  })
  it("Start Doc Analysis", async function () {
    /* ACCESS_TOKEN='yg1QGMlt2AAxYzfWuXSwwQX4wMDAb03qE2plKLGqVgA'
    JOB_ID="63bfcd2f3c141d0032bf4697" */
    let body = dataGenerator.update_AttributeValue(JSON.stringify(startDocTestData), "job_id", JOB_ID);
    var resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    //genericMethods.addContext(this, 'INPUT', body)
    //genericMethods.addContext(this, 'OUTPUT', resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK)
    }
    else {
      assert.fail("resp is undefined", resp)
    }

  })
  it("Get Job Documents", async function () {
   /*  ACCESS_TOKEN="O2VMZqiCjvg4AV83YAXuETMtvd2K8VwLodktZwk"
    JOB_ID="63bfea463c141d0032bf470a" */
    let SUB_URL_GET_JOB_DOCUMENT = `/api/job/${JOB_ID}/documents`
    let URL_GET_JOB_DOCUMENT = configData.BASE_URL + SUB_URL_GET_JOB_DOCUMENT
    console.log(URL_GET_JOB_DOCUMENT)
    let resp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT, {
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    })
    //genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
    //genericMethods.addContext(this, 'OUTPUT', resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      let bodyObj = JSON.parse(resp.body);
      /*  assert.exists(bodyObj[0]["_id"]);
       console.log("REsponse is", bodyObj[0])
       assert.equal(bodyObj[0]["metadata"]["job_id"], JOB_ID); */
      var DataFetchCounter = 0, DataFetch = true, filesDataFetch
      // To count number of records for the given job_id
      /* await delay(80000);
      var filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
      console.log("MongoDbDataFetch:Get DOcumnet results",filesDataFetch)*/
      await delay(80000) ;

      do {
        filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
        console.log(filesDataFetch.length)
        console.log("filesDataFetch[0]",filesDataFetch[0]["metadata"]["status"])
        if (filesDataFetch.length > 0 && filesDataFetch[0]["metadata"]["status"] == "DONE") {
          document_label = filesDataFetch[0]["metadata"]["classification"]
          console.log("document label i", document_label)
          DataFetch = false;
          break
        } else
          if (DataFetchCounter <= 15) {
            await delay(40000);
            DataFetchCounter++;
          } else {
            DataFetch = false;
          }

      }
      while (DataFetch)
      //genericMethods.addContext(this, 'file.files MongoDB Data', filesDataFetch);
      document_label = filesDataFetch[0]["metadata"]["classification"];
    }
    else {
      assert.fail(" Response is undefined", resp);
    }
  })
  it("Get Job Document Result", async function () {
    ACCESS_TOKEN="dJ06F4u8-FtqSRbQCwlPJanTzNDUiuCvCZec8obP9Xp"
    JOB_ID="63cf824590458500300cf243"
    
     FILE_ID ="63cf826790458500300cf245"
    //console.log("Document Lable", document_label);
    let documentResults = await genericMethods.mongoDBDataFetch("document", { "document_label": "PASSPORT" }, '');
    var doc_id=documentResults[0].docid;
    
    // csv to JSON convertion
    const expectedFormField = await csv().fromFile(csvFilePath);
    /* JOB_ID="63cf824590458500300cf243"
    ACCESS_TOKEN="1Mhds1LGjDKE_s_j0ZDX5rcrQtV7sve-nct-hof0Pyw"
    var FILE_ID ="63cf826790458500300cf245" */
    await delay(1000);
    var URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID}/result`
    //  console.log("URL_GET_JOB_DOCUMENT_RESULT", URL_GET_JOB_DOCUMENT_RESULT)
    let resp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT, {
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    })

    //genericMethods.addContext(this, 'RESPONSE', resp.body);
    //Engine Result
    let EngineResultField = JSON.parse(resp.body);
    EngineResultField = EngineResultField[0]["form_fields"];

    // Document Result
    let documentFieldResults = documentResults[0]["rules"]["form_fields"];
    let a = new TestEngineResult(EngineResultField, documentFieldResults);
    console.log(a.validateFormField(EngineResultField, documentFieldResults));
  })
})