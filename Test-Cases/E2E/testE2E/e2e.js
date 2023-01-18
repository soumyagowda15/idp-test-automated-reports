const chai = require('chai')
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs')
const delay = require('delay');
const chaiHttp = require("chai-http")
const csv = require('csvtojson')
const csvFilePath = 'comparision.csv'
chai.use(chaiHttp);
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json')
const createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json')
const startDocTestData = require('../../../Configuration-Test_Data/Test-Data/testStartDocAnalysis.json')
const genericMethods = require('../../../generic-Methods/generic_Methods');
const dataGenerator = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration')
const configData = require('../../../Configuration-Test_Data/config/test_Config');
const { mongoDBDataFetch } = require('../../../generic-Methods/generic_Methods');
const comparisionFile = require("../../../Configuration-Test_Data/config/comparisionData/comparision.json");
const { count } = require('console');
const URL_ACCESS_TOKEN = configData.URL
URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB
URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS
var JOB_ID, ACCESS_TOKEN
const FILE_ID = []

describe("IDP E2E Flow", async function () {

  it("Get an access token", async function () {
    var formBody = [];
    for (var data in testData) {
      var encodedKey = encodeURIComponent(data);
      var encodedValue = encodeURIComponent(testData[data]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    resp = await genericMethods.postAPICall(URL_ACCESS_TOKEN, {
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    genericMethods.addContext(this, 'INPUT ', formBody);
    genericMethods.addContext(this, 'OUTPUT ', resp.body);

    if (resp !== undefined) {
      let bodyObj = JSON.parse(resp.body);
      console.log("Access Token ", bodyObj)
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
      assert.exists(bodyObj.access_token);
      console.log("accesss Token is", bodyObj.access_token)
      ACCESS_TOKEN = bodyObj.access_token
      assert.exists(bodyObj.expires_in)
      assert.equal(bodyObj.token_type, 'Bearer');
    }
    else {
      assert.fail(resp, " is undefined");
    }
  })

  it("Create a Job", async function () {
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
      let bodyObj = JSON.parse(resp.body);
      assert.equal(bodyObj[0].job_type, "doc_analysis");
      assert.equal(bodyObj[0].status, "CREATED");
      assert.exists(bodyObj[0]._id)
      JOB_ID = bodyObj[0]._id
      let createJobData = (await genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name }, ''));
      console.log("mongo Data", createJobData)
      genericMethods.addContext(this, 'JOBS MongoDB Data', createJobData);
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
      console.log("length", Documentlength)

      for (documentCount = 1; documentCount <= Documentlength; documentCount++) {
        const api = chai.request(configData.BASE_URL);
        var resp = await api.post(configData.SUB_URL_UPLOAD_DOCUMENT)
          .set('Content-Type', 'multipart/form-data')
          .set('tenant', 'neutrinos')
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport${documentCount}.pdf`), `Passport${documentCount}.pdf`)
          .field('job_id', JOB_ID)
        genericMethods.addContext(this, 'OUTPUT', resp.body);
        let uploadDocData = (await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
        console.log("mongo Data", uploadDocData)
        genericMethods.addContext(this, `files.files MongoDB Data${documentCount}`, uploadDocData);
        if (resp !== undefined) {
          // let bodyObj = JSON.parse(resp.body);

          assert.equal(resp.statusCode, HTTPStatusCodes.OK);

          assert.exists(resp.body._id);
          console.log(resp.body._id)
          file_id = resp.body._id
          FILE_ID.push(file_id)
          console.log("FILE_ID", FILE_ID)
        }
        else {
          assert.fail(resp, " response is undefined")
        }



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
    resp = await genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
      body: body,
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    genericMethods.addContext(this, 'INPUT', body)
    genericMethods.addContext(this, 'OUTPUT', resp.body)
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK)
    }
    else {
      assert.fail("resp is undefined", resp)
    }

  })
  it("Get Job Documents", async function () {
    /* ACCESS_TOKEN="O2VMZqiCjvg4AV83YAXuETMtvd2K8VwLodktZwk-b8o"
    JOB_ID="63bfea463c141d0032bf470a" */
    let SUB_URL_GET_JOB_DOCUMENT = `/api/job/${JOB_ID}/documents`
    URL_GET_JOB_DOCUMENT = configData.BASE_URL + SUB_URL_GET_JOB_DOCUMENT
    console.log(URL_GET_JOB_DOCUMENT)
    resp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT, {
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
    genericMethods.addContext(this, 'OUTPUT', resp.body);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
      let bodyObj = JSON.parse(resp.body);
      /*  assert.exists(bodyObj[0]["_id"]);
       console.log("REsponse is", bodyObj[0])
       assert.equal(bodyObj[0]["metadata"]["job_id"], JOB_ID); */
      var DataFetchCounter = 0, DataFetch = true, MongoDbDataFetch
      // To count number of records for the given job_id

      do {
        MongoDbDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
        for (MongoDBDataCount = 0; MongoDBDataCount < MongoDbDataFetch.length; MongoDBDataCount++) {
          if (MongoDbDataFetch[MongoDBDataCount]["metadata"]["status"] == "DONE") {
            DataFetch = false;
            break
          } else
            if (DataFetchCounter <= 10) {
              await delay(40000);
              DataFetchCounter++;
            } else {
              DataFetch = false;
            }
        }
      }
      while (DataFetch)
      genericMethods.addContext(this, 'file.files MongoDB Data', MongoDbDataFetch)
    }
    else {
      assert.fail(" Response is undefined", resp);
    }
  })
  it("Get Job Document Result", async function () {
    /* JOB_ID="63bfea463c141d0032bf470a"
    ACCESS_TOKEN="O2VMZqiCjvg4AV83YAXuETMtvd2K8VwLodktZwk-b8o"
    FILE_ID =["63c6d21e7a7f0100306c7070","63c6d2247a7f0100306c7075","63c6d2287a7f0100306c7078","63c6d22d7a7f0100306c707b","63c6d2327a7f0100306c707e"]
    console.log("file",FILE_ID[0]) */
    /* let SUB_URL_GET_JOB_DOCUMENT_RESULT = `/api/job/${JOB_ID}/file/${FILE_ID}/result`
    console.log("SUB_URL_GET_JOB_DOCUMENT_RESULT",SUB_URL_GET_JOB_DOCUMENT_RESULT) */

    // fields verification for passport
    // convert csv to json
    csv().fromFile(csvFilePath).then((jsonObj) => { })
    const jsonArray = await csv().fromFile(csvFilePath);
    console.log(jsonArray)

    var comparisionKeys = Object.keys(jsonArray[0]);
    genericMethods.addContext(this, 'Expected Keys to be extracted', comparisionKeys);
    for (fileIdCount = 0; fileIdCount < FILE_ID.length; fileIdCount++) {
      MongoDbDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
      for (count1 = 0; count1 < MongoDbDataFetch.length; count1++) {
        if ((file_id == (MongoDbDataFetch[count1]["_id"])) && MongoDbDataFetch[count1]["metadata"]["status"] == "DONE") {
          URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID[fileIdCount]}/result`
          console.log("URL_GET_JOB_DOCUMENT_RESULT", URL_GET_JOB_DOCUMENT_RESULT)
          resp = await genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT, {
            headers:
            {
              "tenant": configData.TENANT,
              "Authorization": `Bearer ${ACCESS_TOKEN}`
            }
          })
          genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
          genericMethods.addContext(this, 'INPUT', "file_id:" + FILE_ID[fileIdCount]);
          genericMethods.addContext(this, 'OUTPUT', resp.body);

          if (resp !== undefined) {
            assert.equal(resp.statusCode, HTTPStatusCodes.OK);
            let bodyObj = JSON.parse(resp.body);
            assert.exists(bodyObj[0]["_id"]);
            //assert.equal(bodyObj[0]["file_id"], FILE_ID);
            assert.equal(bodyObj[0]["job_id"], JOB_ID);

            var fieldExtracted = [];
            for (formCount = 0; formCount < bodyObj[0]["form_fields"].length; formCount++) {
              if ((bodyObj[0]["form_fields"][formCount]).hasOwnProperty("config")) {

                if (comparisionKeys.includes(bodyObj[0]["form_fields"][formCount]["config"]["_n_field_label_"])) {
                  console.log(bodyObj[0]["form_fields"][formCount]["config"]["_n_field_label_"] + ":" + bodyObj[0]["form_fields"][formCount]["config"]["_n_field_value_"])
                  fieldExtracted.push(bodyObj[0]["form_fields"][formCount]["config"]["_n_field_label_"] + "   :   " + bodyObj[0]["form_fields"][formCount]["config"]["_n_field_value_"])
                }

              }

            }

            genericMethods.addContext(this, `Extracted Fields from Document${fileIdCount}`, fieldExtracted);
          }
          else {
            assert.fail("Response is undefined", resp);
          }
        }
      }
    }

  })

  it.skip("Get Document", async function () {
    /*  JOB_ID="63bfe13e3c141d0032bf46c4"
     ACCESS_TOKEN="1b0sD6mo-CY-NlHZxneGbNklT6nubuag-CinNu5cgp5"
     FILE_ID="63bfe1693c141d0032bf46c6" */
    let SUB_URL_GET_DOCUMENT = `/api/job/${JOB_ID}/file/${FILE_ID}`
    URL_GET_DOCUMENT = configData.BASE_URL + SUB_URL_GET_DOCUMENT
    console.log(URL_GET_DOCUMENT)
    resp = await genericMethods.getAPICall(URL_GET_DOCUMENT, {
      headers:
      {
        "tenant": configData.TENANT,
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    })
    genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID + "  file_id:" + FILE_ID);
    // genericMethods.addContext(this,'OUTPUT',resp);
    if (resp !== undefined) {
      assert.equal(resp.statusCode, HTTPStatusCodes.OK);
    }
    else {
      assert.fail("Response is undefined", resp);
    }
  })

})