import { TestEngineResult } from '../../E2E/testE2E/documentProcessing'
import { assert, expect } from "chai";
import fs from 'fs';
import delay from 'delay';
import csv from 'csvtojson';
import path from 'path';
import dotenv from 'dotenv';
import * as Mocha from 'mocha';
import HTTPStatusCodes from 'http-status-codes';
import createJobTestData from '../../../ConfigurationTestData/Test-Data/testCreateJob.json';
import startDocTestData from '../../../ConfigurationTestData/Test-Data/testStartDocAnalysis.json';
const configData=require('../../../ConfigurationTestData/config/test_Config');
const genericMethods=require('../../../genericMethods/generic_Methods');
const dataGeneration=require('../../../ConfigurationTestData/Test-Data/Data-Generation/dataGeneration')
import chai from 'chai';
import chaiHttp from 'chai-http';

dotenv.config({ path: path.resolve("environment", `${process.env.NODE_ENV}.env`) });
chai.use(chaiHttp);
const accessTokenData=new dataGeneration(configData.auth);
const URL_CREATE_JOB = `${process.env.BASE_URL}${configData.SUB_URL_CREATE_JOB}`;
const URL_START_DOC_ANALYSIS = `${process.env.BASE_URL}${configData.URL_START_DOC_ANALYSIS}`;
const DocumentsFolderPath = './Attachment/Vitenam_passport';
let ACCESS_TOKEN: string, JOB_ID:string, FILE_ID:string, FILES:any;
describe("Neutrinos IDP E2E Testing",async function(){
  
  describe("End to End Testing", async function () {
    // count the number of files in the directory
    before(async function(){
      fs.readdir(DocumentsFolderPath, (err: any, files: any) => {
        if (err) {
          console.error(err);
        } else {
          FILES = files;
          console.log(`Found ${FILES.length} files in ${DocumentsFolderPath}`);
        }
      });
    })
    it("Get an access token", async () => {
      //update testData &encode testData
      const body = await accessTokenData.setValue("client_id", process.env.CLIENT_ID)
                                        .setValue("client_secret", process.env.CLIENT_SECRET)
                                        .setValue("grant_type", configData.GRANT_TYPE)
                                        .encode();
      //Send request to fetch access Token
      var resp = await genericMethods.postApiCall(configData.URL_ACCESS_TOKEN, {
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      // Assertion for response
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        assert.equal(resp.statusCode, HTTPStatusCodes.OK);
        ACCESS_TOKEN = bodyObj.access_token;
        console.log("ACCESS_TOKEN",ACCESS_TOKEN)
      }
      else {
        assert.fail(resp, " is undefined");
      }
    })
    it("Create a Job", async () => {
      let body = JSON.stringify(createJobTestData);
      let resp = await genericMethods.postApiCall(URL_CREATE_JOB, {
        body: body,
        headers: {
          "Content-Type": "application/json",
          "tenant": "neutrinos",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      })
      if (resp !== undefined) {
        let bodyObj = JSON.parse(resp.body);
        let jobsMongoData = await genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name });
        assert.equal(bodyObj[0].job_type, "doc_analysis");
        assert.equal(bodyObj[0].status, "CREATED");
        assert.exists(bodyObj[0]._id)
        JOB_ID = bodyObj[0]._id
        console.log("JOB_ID",JOB_ID)  
          }
      else {
        assert.fail(resp, "is undefined")
      }
    })
    
    it("Similart Check-upload Document,Document Analysis, Get job Document Result", async function () {  
      console.log(FILES.length)
       for (let i=0;i<FILES.length;i++)
          { 
        var docUploadResp = await chai.request(process.env.BASE_URL).post(configData.SUB_URL_UPLOAD_DOCUMENT)
        .set('Content-Type', 'multipart/form-data')
        .set('tenant', 'neutrinos')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .attach('files', fs.createReadStream(`${DocumentsFolderPath}/${FILES[i]}`), FILES[i])
        .field('job_id', JOB_ID);

      // files.files MongoDB Data
      let uploadDocMongoData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
      genericMethods.addContext(this, 'Upload Document', uploadDocMongoData)
      if (docUploadResp !== undefined) {
        assert.exists(docUploadResp.body["_id"]);
        FILE_ID = docUploadResp.body["_id"];
      }
      else {
        assert.fail(docUploadResp, "Response is undefined");
      }

      //start Document Analysis
      var startDocData=new dataGeneration(startDocTestData);
      let body = startDocData.updateValue("job_id", JOB_ID);

      var startDocResp = await genericMethods.postApiCall(URL_START_DOC_ANALYSIS, {
        body: JSON.stringify(body),
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
         let URL_GET_JOB_DOCUMENT = process.env.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID}`;
        let jobDocumentresp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT, {
          headers:
          {
            "tenant": configData.TENANT,
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        })
        if (jobDocumentresp !== undefined) {
          assert.equal(jobDocumentresp.statusCode, HTTPStatusCodes.OK);
          var DataFetchCounter = 0, DataFetch = true, filesDataFetch;
          await delay(80000);
          do {
            filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
           if (filesDataFetch.length > 0 && filesDataFetch[0]["metadata"]["status"] == "DONE") {
              DataFetch = false;
              break
            } else
              if (DataFetchCounter <=20) {
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
        let URL_GET_JOB_DOCUMENT_RESULT = process.env.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;
        let jobDocResultResp = await genericMethods.getApiCall(URL_GET_JOB_DOCUMENT_RESULT, {
          headers: {
            "tenant": configData.TENANT,
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        });
        let bodyObj = JSON.parse(jobDocResultResp.body);
        let documentResults = await genericMethods.mongoDBDataFetch("document", { "document_label": bodyObj[0]["classification"][0]["tag_name"] });
    
        let EngineResultField = await genericMethods.mongoDBDataFetch("transformed_engine_result", { "file_id": FILE_ID });
        let fileName=EngineResultField[0].metadata.filename;
        let a = new TestEngineResult(EngineResultField, documentResults);
        try {
          await a.validateFormField(EngineResultField[0]["form_fields"], documentResults[0]["rules"]["form_fields"],fileName);
        } catch (err) {
          console.log('err', err)
        }
      }
    })
    })
  })



