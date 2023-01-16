const chai=require("chai");
const expect=require("chai").expect;
const fs=require('fs')
const chaiHttp=require("chai-http")
chai.use(chaiHttp);
//const file=require('../../../Attachment/test.js')

const api=chai.request('https://api-dot-idp-docs-sandbox.el.r.appspot.com')
describe("Create Job", async function () {

    
    it.only("Upload Document to the Job", async function () {
       
     var resp= await api.post("/api/job/documents/upload")
    
       .set('Content-Type','multipart/form-data')
       .set('tenant','neutrinos')
       .set('Authorization','Bearer B7q2S6T0bPMJmz8LQbrsxN716WUpqycEtdQQ3ihF7uU')
       
      .attach('files',fs.createReadStream('../../../Attachment/AdharCard.pdf'),'AdharCard.pdf')
      .field('job_id','63b67854fc06f8003b329260')
       
           
       
        expect(resp).to.have.status(200)
       console.log("response is",resp)
       console.log("******************")
       console.log("response body",resp.body)
    })
})