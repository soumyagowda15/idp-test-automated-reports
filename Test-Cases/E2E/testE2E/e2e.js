"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var documentProcessing_1 = require("../../E2E/testE2E/documentProcessing");
var assert = require('chai').assert;
var expect = require("chai").expect;
var fs = require('fs');
var delay = require('delay');
var chai = require("chai");
var chaiHttp = require("chai-http");
var csv = require('csvtojson');
//const csvFilePath = '../../../CsvFiles/testData/comparision.csv'
var csvFilePath = 'comparision.csv';
//chai.use(chaiHttp);
var HTTPStatusCodes = require('http-status-codes');
var HTTPStatusCode = require('http-status-code');
var testData = require('../../../Configuration-Test_Data/Test-Data/Access-Token/testData/testAccessToken.json');
var createJobTestData = require('../../../Configuration-Test_Data/Test-Data/testCreateJob.json');
var startDocTestData = require('../../../Configuration-Test_Data/Test-Data/testStartDocAnalysis.json');
var genericMethods = require('../../../generic-Methods/generic_Methods');
var dataGenerator = require('../../../Configuration-Test_Data/Test-Data/Data-Generation/dataGeneration');
var configData = require('../../../Configuration-Test_Data/config/test_Config');
var mongoDBDataFetch = require('../../../generic-Methods/generic_Methods').mongoDBDataFetch;
//const comparisionFile = require("../../../Configuration-Test_Data/config/comparisionData/comparision.json");
var count = require('console').count;
var URL_ACCESS_TOKEN = configData.URL;
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB;
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS;
var ACCESS_TOKEN, JOB_ID, FILE_ID;
var document_label;
/* async function DocumentResult()
{ */
describe("test", function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("Get an access token", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var formBody, data, encodedKey, encodedValue, body, resp, bodyObj;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                formBody = [];
                                for (data in testData) {
                                    encodedKey = encodeURIComponent(data);
                                    encodedValue = encodeURIComponent(testData[data]);
                                    formBody.push(encodedKey + "=" + encodedValue);
                                }
                                body = formBody.join("&");
                                return [4 /*yield*/, genericMethods.postAPICall(URL_ACCESS_TOKEN, {
                                        body: body,
                                        headers: {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        }
                                    })];
                            case 1:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'INPUT ', formBody);
                                genericMethods.addContext(this, 'OUTPUT ', resp.body);
                                if (resp !== undefined) {
                                    bodyObj = JSON.parse(resp.body);
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
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it("Create a Job", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var body, resp, bodyObj, createJobData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                body = JSON.stringify(createJobTestData);
                                return [4 /*yield*/, genericMethods.postAPICall(URL_CREATE_JOB, {
                                        body: body,
                                        headers: {
                                            "Content-Type": "application/json",
                                            "tenant": "neutrinos",
                                            "Authorization": "Bearer ".concat(ACCESS_TOKEN)
                                        }
                                    })];
                            case 1:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'INPUT JSON', body);
                                genericMethods.addContext(this, 'OUTPUT JSON', resp.body);
                                if (!(resp !== undefined)) return [3 /*break*/, 3];
                                bodyObj = JSON.parse(resp.body);
                                assert.equal(bodyObj[0].job_type, "doc_analysis");
                                assert.equal(bodyObj[0].status, "CREATED");
                                assert.exists(bodyObj[0]._id);
                                JOB_ID = bodyObj[0]._id;
                                return [4 /*yield*/, genericMethods.mongoDBDataFetch("jobs", { "job_name": bodyObj[0].job_name }, '')];
                            case 2:
                                createJobData = (_a.sent());
                                console.log("mongo Data", createJobData);
                                genericMethods.addContext(this, 'JOBS MongoDB Data', createJobData);
                                return [3 /*break*/, 4];
                            case 3:
                                assert.fail(resp, "is undefined");
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            it("Upload Document to the Job", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var Documentlength, api, resp, uploadDocData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(JOB_ID !== undefined || JOB_ID !== null)) return [3 /*break*/, 3];
                                Documentlength = fs.readdirSync('../../../Attachment/Passport').length;
                                console.log("length", Documentlength);
                                chai.use(chaiHttp);
                                api = chai.request(configData.BASE_URL);
                                return [4 /*yield*/, api.post("/api/job/documents/upload")
                                        .set('Content-Type', 'multipart/form-data')
                                        .set('tenant', 'neutrinos')
                                        .set('Authorization', "Bearer ".concat(ACCESS_TOKEN))
                                        .attach('files', fs.createReadStream("../../../Attachment/Passport/Passport.pdf"), "Passport.pdf")
                                        .field('job_id', JOB_ID)];
                            case 1:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'OUTPUT', resp.body);
                                return [4 /*yield*/, genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '')];
                            case 2:
                                uploadDocData = (_a.sent());
                                console.log("mongo Data", uploadDocData);
                                genericMethods.addContext(this, "files.files MongoDB Data", uploadDocData);
                                if (resp !== undefined) {
                                    // let bodyObj = JSON.parse(resp.body);
                                    //  assert.equal(resp.statusCode, HTTPStatusCodes.OK);
                                    assert.exists(resp.body._id);
                                    console.log(resp.body._id);
                                    FILE_ID = resp.body._id;
                                    console.log("FILE_ID", FILE_ID);
                                }
                                else {
                                    assert.fail(resp, " response is undefined");
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                assert.fail(JOB_ID, "JOB ID is undefined/Null");
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            it("Start Doc Analysis", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var body, resp;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                body = dataGenerator.update_AttributeValue(JSON.stringify(startDocTestData), "job_id", JOB_ID);
                                return [4 /*yield*/, genericMethods.postAPICall(URL_START_DOC_ANALYSIS, {
                                        body: body,
                                        headers: {
                                            "tenant": configData.TENANT,
                                            "Authorization": "Bearer ".concat(ACCESS_TOKEN),
                                            "Content-Type": "application/json"
                                        }
                                    })];
                            case 1:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'INPUT', body);
                                genericMethods.addContext(this, 'OUTPUT', resp.body);
                                if (resp !== undefined) {
                                    assert.equal(resp.statusCode, HTTPStatusCodes.OK);
                                }
                                else {
                                    assert.fail("resp is undefined", resp);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it("Get Job Documents", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var SUB_URL_GET_JOB_DOCUMENT, URL_GET_JOB_DOCUMENT, resp, bodyObj, DataFetchCounter, DataFetch, filesDataFetch;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                SUB_URL_GET_JOB_DOCUMENT = "/api/job/".concat(JOB_ID, "/documents");
                                URL_GET_JOB_DOCUMENT = configData.BASE_URL + SUB_URL_GET_JOB_DOCUMENT;
                                console.log(URL_GET_JOB_DOCUMENT);
                                return [4 /*yield*/, genericMethods.getAPICall(URL_GET_JOB_DOCUMENT, {
                                        headers: {
                                            "tenant": configData.TENANT,
                                            "Authorization": "Bearer ".concat(ACCESS_TOKEN)
                                        }
                                    })];
                            case 1:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'INPUT', "job_id:" + JOB_ID);
                                genericMethods.addContext(this, 'OUTPUT', resp.body);
                                if (!(resp !== undefined)) return [3 /*break*/, 10];
                                assert.equal(resp.statusCode, HTTPStatusCodes.OK);
                                bodyObj = JSON.parse(resp.body);
                                DataFetchCounter = 0, DataFetch = true;
                                // To count number of records for the given job_id
                                /* await delay(80000);
                                var filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
                                console.log("MongoDbDataFetch:Get DOcumnet results",filesDataFetch)*/
                                return [4 /*yield*/, delay(80000)];
                            case 2:
                                // To count number of records for the given job_id
                                /* await delay(80000);
                                var filesDataFetch = await genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '');
                                console.log("MongoDbDataFetch:Get DOcumnet results",filesDataFetch)*/
                                _a.sent();
                                _a.label = 3;
                            case 3: return [4 /*yield*/, genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, '')];
                            case 4:
                                filesDataFetch = _a.sent();
                                console.log(filesDataFetch.length);
                                console.log("filesDataFetch[0]", filesDataFetch[0]["metadata"]["status"]);
                                if (!(filesDataFetch.length > 0 && filesDataFetch[0]["metadata"]["status"] == "DONE")) return [3 /*break*/, 5];
                                document_label = filesDataFetch[0]["metadata"]["classification"];
                                console.log("document label i", document_label);
                                DataFetch = false;
                                return [3 /*break*/, 9];
                            case 5:
                                if (!(DataFetchCounter <= 15)) return [3 /*break*/, 7];
                                return [4 /*yield*/, delay(40000)];
                            case 6:
                                _a.sent();
                                DataFetchCounter++;
                                return [3 /*break*/, 8];
                            case 7:
                                DataFetch = false;
                                _a.label = 8;
                            case 8:
                                if (DataFetch) return [3 /*break*/, 3];
                                _a.label = 9;
                            case 9:
                                genericMethods.addContext(this, 'file.files MongoDB Data', filesDataFetch);
                                document_label = filesDataFetch[0]["metadata"]["classification"];
                                return [3 /*break*/, 11];
                            case 10:
                                assert.fail(" Response is undefined", resp);
                                _a.label = 11;
                            case 11: return [2 /*return*/];
                        }
                    });
                });
            });
            it("Get Job Document Result", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var documentResults, doc_id, expectedFormField, URL_GET_JOB_DOCUMENT_RESULT, resp, EngineResultField, documentFieldResults, a;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ACCESS_TOKEN = "DxH2L2WLeYfLlc-wArl4jHci0akMbCRIUuM_M5AWtLx";
                                JOB_ID = "63cf824590458500300cf243";
                                FILE_ID = "63cf826790458500300cf245";
                                return [4 /*yield*/, genericMethods.mongoDBDataFetch("document", { "document_label": "PASSPORT" }, '')];
                            case 1:
                                documentResults = _a.sent();
                                doc_id = documentResults[0].docid;
                                return [4 /*yield*/, csv().fromFile(csvFilePath)];
                            case 2:
                                expectedFormField = _a.sent();
                                /* JOB_ID="63cf824590458500300cf243"
                                ACCESS_TOKEN="1Mhds1LGjDKE_s_j0ZDX5rcrQtV7sve-nct-hof0Pyw"
                                var FILE_ID ="63cf826790458500300cf245" */
                                return [4 /*yield*/, delay(1000)];
                            case 3:
                                /* JOB_ID="63cf824590458500300cf243"
                                ACCESS_TOKEN="1Mhds1LGjDKE_s_j0ZDX5rcrQtV7sve-nct-hof0Pyw"
                                var FILE_ID ="63cf826790458500300cf245" */
                                _a.sent();
                                URL_GET_JOB_DOCUMENT_RESULT = configData.BASE_URL + "/api/job/".concat(JOB_ID, "/file/").concat(FILE_ID, "/result");
                                return [4 /*yield*/, genericMethods.getAPICall(URL_GET_JOB_DOCUMENT_RESULT, {
                                        headers: {
                                            "tenant": configData.TENANT,
                                            "Authorization": "Bearer ".concat(ACCESS_TOKEN)
                                        }
                                    })];
                            case 4:
                                resp = _a.sent();
                                genericMethods.addContext(this, 'RESPONSE', resp.body);
                                EngineResultField = JSON.parse(resp.body);
                                EngineResultField = EngineResultField[0]["form_fields"];
                                documentFieldResults = documentResults[0]["rules"]["form_fields"];
                                a = new documentProcessing_1.TestEngineResult(EngineResultField, documentFieldResults);
                                console.log(a.validateFormField(EngineResultField, documentFieldResults));
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
});
