import { TestEngineResult } from '../../E2E/testE2E/documentProcessing'
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs')
const delay = require('delay');
const csv = require('csvtojson')
import * as Mocha from 'mocha'
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const testData = require('../../../ConfigurationTestData/Test-Data/Access-Token/testData/testAccessToken.json')
const createJobTestData = require('../../../ConfigurationTestData/Test-Data/testCreateJob.json')
const startDocTestData = require('../../../ConfigurationTestData/Test-Data/testStartDocAnalysis.json')
const genericMethods = require('../../../genericMethods/generic_Methods');
const dataGenerator = require('../../../ConfigurationTestData/Test-Data/Data-Generation/dataGeneration')
const configData = require('../../../ConfigurationTestData/config/test_Config');
const URL_ACCESS_TOKEN = configData.URL
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS
var ACCESS_TOKEN: string, JOB_ID: string, FILE_ID: string,FILES:any,Documentlength: number;
var document_label: string;
import chai from 'chai';
import chaiHttp from 'chai-http';
const directoryPath = 'idp-automated-tests/CsvFiles/testData';
const folderPath ='Attachment/Vitenam_passport'
const sendMail=require('./sendMail.js')

describe("Neutrinos IDP E2E Testing",async function(){
  after(async function(){
    console.log("after loop executed");
    await sendMail.sendCSVReport(directoryPath)



  })
  describe("End to End Testing", async function () {
    // count the number of files in the directory
    before(async function(){
      fs.readdir(folderPath, (err: any, files: any) => {
        if (err) {
          console.error(err);
        } else {
          FILES = files;
          console.log(`Found ${FILES.length} files in ${folderPath}`);
        }
      });
    })
    it("Get an access token", async () => {
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

    it("Create a Job", async () => {
      let body = JSON.stringify(createJobTestData);
      let resp = await genericMethods.postAPICall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
    
      })
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        assert.equal(bodyObj[0].job_type, "doc_analysis");
        assert.equal(bodyObj[0].status, "CREATED");
        assert.exists(bodyObj[0]._id)
        JOB_ID = bodyObj[0]._id
        let createJobData = (await genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name }, ''));
      }
      else {
        assert.fail(resp, "is undefined")
      }
    })
    
    it("Similart Check", async function () {
      /* ACCESS_TOKEN="zPPyGIXVloIKCQvPcJ7ZsnaAtOO3IMAzO5AWWveNsJ-"
      JOB_ID="63e529aa52e7f50019ed74eb" */
      //Upload Documents
      console.log(FILES.length)
      for (let i=0;i<FILES.length;i++)
      {
        chai.use(chaiHttp);
        const api = chai.request(configData.BASE_URL)
        var docUploadResp = await api.post("/api/job/documents/upload")
          .set('Content-Type', 'multipart/form-data')
          .set('tenant', 'neutrinos')
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .attach('files', fs.createReadStream(`./Attachment/Vitenam_passport/${FILES[i]}`), FILES[i])
          .field('job_id', JOB_ID);
          console.log(docUploadResp.body)
        let uploadDocData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
        if (docUploadResp !== undefined) {
          assert.exists(docUploadResp.body._id);
          FILE_ID = docUploadResp.body._id
        }
        else {
          assert.fail(docUploadResp, " response is undefined")
        }
         //start Document Analysis
         let body = dataGenerator.update_AttributeValue(JSON.stringify(startDocTestData), "job_id", JOB_ID);
         var startDocResp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
           body: body,
           headers:
           {
             "tenant": configData.TENANT,
             "Authorization": `Bearer ${ACCESS_TOKEN}`,
             "Content-Type": "application/json"
           }
         })
         if (startDocResp !== undefined) {
           assert.equal(startDocResp.statusCode, HTTPStatusCodes.OK)
         }
         else {
           assert.fail("resp is undefined", startDocResp)
         }
    
         //Get Job Document
         let SUB_URL_GET_JOB_DOCUMENT = `/api/job/${JOB_ID}/documents`
        let URL_GET_JOB_DOCUMENT = configData.BASE_URL + SUB_URL_GET_JOB_DOCUMENT
        console.log(URL_GET_JOB_DOCUMENT)
        let jobDocumentresp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT, {
          headers:
          {
            "tenant": configData.TENANT,
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        })
        
        if (jobDocumentresp !== undefined) {
          assert.equal(jobDocumentresp.statusCode, HTTPStatusCodes.OK);
          let bodyObj = JSON.parse(jobDocumentresp.body);
          var DataFetchCounter = 0, DataFetch = true, filesDataFetch;
          await delay(80000);
          do {
            filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
            console.log(filesDataFetch.length)
            console.log("filesDataFetch[0]", filesDataFetch[0]["metadata"]["status"])
            if (filesDataFetch.length > 0 && filesDataFetch[0]["metadata"]["status"] == "DONE") {
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
        }
        else {
          assert.fail(" Response is undefined", jobDocumentresp);
        }
        //Job Document Result
        var URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;
        let jobDocResultResp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT, {
          headers: {
            "tenant": configData.TENANT,
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        });
        genericMethods.addContext(this, 'RESPONSE', jobDocResultResp.body);
        let bodyObj = JSON.parse(jobDocResultResp.body);
        console.log("Document Lable",bodyObj[0]["classification"][0]["tag_name"] )
        let documentResults = await genericMethods.mongoDBDataFetch("document", { "document_label": bodyObj[0]["classification"][0]["tag_name"] });
    
        let EngineResultField = await genericMethods.mongoDBDataFetch("transformed_engine_result", { "file_id": FILE_ID });
        let documentFieldResults = documentResults[0]["rules"]["form_fields"];
        let a = new TestEngineResult(EngineResultField, documentFieldResults);
        try {
          await a.validateFormField(EngineResultField[0]["form_fields"], documentFieldResults);
        } catch (err) {
          console.log('err', err)
        }
      }
    })
    })
  })



