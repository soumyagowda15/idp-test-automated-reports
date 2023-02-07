"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const documentProcessing_1 = require("../../E2E/testE2E/documentProcessing");
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs');
const delay = require('delay');
const chai = __importStar(require("chai"));
const chaiHttp = require("chai-http");
const csv = require('csvtojson');
const csvFilePath = 'comparision.csv';
const HTTPStatusCodes = require('http-status-codes');
const HTTPStatusCode = require('http-status-code');
const testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json');
const createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json');
const startDocTestData = require('../../../Configuration-Test_Data/Test-Data/testStartDocAnalysis.json');
const genericMethods = require('../../../generic-Methods/generic_Methods');
const dataGenerator = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration');
const configData = require('../../../Configuration-Test_Data/config/test_Config');
const URL_ACCESS_TOKEN = configData.URL;
var addContext = require('mochawesome/addContext');
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB;
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS;
var ACCESS_TOKEN, JOB_ID, FILE_ID;
var document_label;
addContext: (object, title, value) => {
    try {
        addContext(object, {
            title: title,
            value: value
        });
    }
    catch (error) {
        return error;
    }
};
describe("test", function () {
    return __awaiter(this, void 0, void 0, function* () {
        it("Get an access token", () => __awaiter(this, void 0, void 0, function* () {
            let formBody = [];
            for (var data in testData) {
                var encodedKey = encodeURIComponent(data);
                var encodedValue = encodeURIComponent(testData[data]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            var body = formBody.join("&");
            let resp = yield genericMethods.postAPICall(URL_ACCESS_TOKEN, {
                body: body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if (resp !== undefined) {
                let bodyObj = JSON.parse(resp.body);
                assert.equal(resp.statusCode, HTTPStatusCodes.OK);
                assert.equal(resp.statusMessage, HTTPStatusCode.getMessage(200));
                assert.exists(bodyObj.access_token);
                assert.exists(bodyObj.expires_in);
                assert.equal(bodyObj.token_type, 'Bearer');
                ACCESS_TOKEN = bodyObj.access_token;
            }
            else {
                assert.fail(resp, " is undefined");
            }
        }));
        it("Create a Job", () => __awaiter(this, void 0, void 0, function* () {
            let body = JSON.stringify(createJobTestData);
            let resp = yield genericMethods.postAPICall(URL_CREATE_JOB, {
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    "tenant": "neutrinos",
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                }
            });
            if (resp !== undefined) {
                let bodyObj = JSON.parse(resp.body);
                assert.equal(bodyObj[0].job_type, "doc_analysis");
                assert.equal(bodyObj[0].status, "CREATED");
                assert.exists(bodyObj[0]._id);
                JOB_ID = bodyObj[0]._id;
                let createJobData = (yield genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name }, ''));
                console.log("mongo Data", createJobData);
            }
            else {
                assert.fail(resp, "is undefined");
            }
        }));
        it("Upload Document to the Job", function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (JOB_ID !== undefined || JOB_ID !== null) {
                    const Documentlength = fs.readdirSync('../../../Attachment/Passport').length;
                    console.log("length", Documentlength);
                    chai.use(chaiHttp);
                    const api = chai.request(configData.BASE_URL);
                    var resp = yield api.post("/api/job/documents/upload")
                        .set('Content-Type', 'multipart/form-data')
                        .set('tenant', 'neutrinos')
                        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
                        .attach('files', fs.createReadStream(`../../../Attachment/Passport/Passport.pdf`), `Passport.pdf`)
                        .field('job_id', JOB_ID);
                    let uploadDocData = (yield genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
                    console.log("mongo Data", uploadDocData);
                    if (resp !== undefined) {
                        assert.exists(resp.body._id);
                        console.log(resp.body._id);
                        FILE_ID = resp.body._id;
                        console.log("FILE_ID", FILE_ID);
                    }
                    else {
                        assert.fail(resp, " response is undefined");
                    }
                }
                else {
                    assert.fail(JOB_ID, "JOB ID is undefined/Null");
                }
            });
        });
        it("Start Doc Analysis", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let body = dataGenerator.update_AttributeValue(JSON.stringify(startDocTestData), "job_id", JOB_ID);
                var resp = yield genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
                    body: body,
                    headers: {
                        "tenant": configData.TENANT,
                        "Authorization": `Bearer ${ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                });
                if (resp !== undefined) {
                    assert.equal(resp.statusCode, HTTPStatusCodes.OK);
                }
                else {
                    assert.fail("resp is undefined", resp);
                }
            });
        });
        it.only("Get Job Documents", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let documentResults = yield genericMethods.mongoDBDataFetch("document", { "document_label": "PASSPORT" }, '');
                var doc_id = documentResults[0].docid;
                let EngineResultField = yield genericMethods.mongoDBDataFetch("transformed_engine_result", { "file_id": "631585c6b5574f001b6e8e9d" }, '');
                let documentFieldResults = documentResults[0]["rules"]["form_fields"];
                let a = new documentProcessing_1.TestEngineResult(EngineResultField, documentFieldResults);
                try {
                    yield a.validateFormField(EngineResultField[0]["form_fields"], documentFieldResults);
                }
                catch (err) {
                    console.log('err', err);
                }
            });
        });
        it("Get Job Document Result", function () {
            return __awaiter(this, void 0, void 0, function* () {
                ACCESS_TOKEN = "dJ06F4u8-FtqSRbQCwlPJanTzNDUiuCvCZec8obP9Xp";
                JOB_ID = "63cf824590458500300cf243";
                FILE_ID = "63cf826790458500300cf245";
                let documentResults = yield genericMethods.mongoDBDataFetch("document", { "document_label": "PASSPORT" }, '');
                var doc_id = documentResults[0].docid;
                const expectedFormField = yield csv().fromFile(csvFilePath);
                yield delay(1000);
                var URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL + `/api/job/${JOB_ID}/file/${FILE_ID}/result`;
                let resp = yield genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT, {
                    headers: {
                        "tenant": configData.TENANT,
                        "Authorization": `Bearer ${ACCESS_TOKEN}`
                    }
                });
                let EngineResultField = JSON.parse(resp.body);
                EngineResultField = EngineResultField[0]["form_fields"];
                let documentFieldResults = documentResults[0]["rules"]["form_fields"];
                let a = new documentProcessing_1.TestEngineResult(EngineResultField, documentFieldResults);
                console.log(a.validateFormField(EngineResultField, documentFieldResults));
            });
        });
    });
});
