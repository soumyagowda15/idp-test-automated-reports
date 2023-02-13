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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs');
const delay = require('delay');
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
const { mongoDBDataFetch } = require('../../../generic-Methods/generic_Methods');
const { count } = require('console');
const URL_ACCESS_TOKEN = configData.URL;
var URL_CREATE_JOB = configData.BASE_URL + configData.SUB_URL_CREATE_JOB;
var URL_START_DOC_ANALYSIS = configData.BASE_URL + configData.URL_START_DOC_ANALYSIS;
var ACCESS_TOKEN, JOB_ID, FILE_ID, FILES, Documentlength;
var document_label;
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const folderPath = '../../../Attachment/Passport/Vitenam_passport';
describe("End to End Testing", function () {
    return __awaiter(this, void 0, void 0, function* () {
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                let formBody = [];
                for (var data in testData) {
                    var encodedKey = encodeURIComponent(data);
                    var encodedValue = encodeURIComponent(testData[data]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                var body = formBody.join("&");
                let accessTokenResp = yield genericMethods.postAPICall(URL_ACCESS_TOKEN, {
                    body: body,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                ACCESS_TOKEN = JSON.parse(accessTokenResp.body).access_token;
                console.log("ACCESS_TOKEN", ACCESS_TOKEN);
                let createJobresp = yield genericMethods.postAPICall(URL_CREATE_JOB, {
                    body: JSON.stringify(createJobTestData),
                    headers: {
                        "Content-Type": "application/json",
                        "tenant": "neutrinos",
                        "Authorization": `Bearer ${ACCESS_TOKEN}`
                    }
                });
                JOB_ID = JSON.parse(createJobresp.body)["_id"];
                fs.readdir(folderPath, (err, files) => {
                    FILES = files;
                    return FILES;
                });
            });
        });
        it("Similarity Check", function () {
            return __awaiter(this, void 0, void 0, function* () {
                for (let filesCount = 0; filesCount < FILES.length; filesCount++) {
                    console.log(FILES[filesCount]);
                    chai_1.default.use(chai_http_1.default);
                    const api = chai_1.default.request(configData.BASE_URL);
                    var resp = yield api.post("/api/job/documents/upload")
                        .set('Content-Type', 'multipart/form-data')
                        .set('tenant', 'neutrinos')
                        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
                        .attach('files', fs.createReadStream(`../../../Attachment/Passport/Vitenam_passport/${FILES[filesCount]}`), FILES[filesCount])
                        .field('job_id', JOB_ID);
                    console.log(resp);
                    let uploadDocData = (yield genericMethods.mongoDBDataFetch("files.files", { "metadata.job_id": JOB_ID }, ''));
                    if (resp !== undefined) {
                        assert.exists(resp.body._id);
                        FILE_ID = resp.body._id;
                    }
                    else {
                        assert.fail(resp, " response is undefined");
                    }
                }
            });
        });
    });
});
