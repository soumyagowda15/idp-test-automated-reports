
const assert = require('chai').assert;
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json')
const genericMethods = require('../../../generic-Methods/generic_Methods');
const configData = require('../../../Configuration-Test_Data/config/test_Config');
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB;
var ACCESS_TOKEN, JOB_ID, FILE_ID;

describe("test", async function () {
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
})