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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const expect = require("chai").expect;
const fs = require('fs');
const delay = require('delay');
const csv = require('csvtojson');
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
const nodemailer = require('nodemailer');
const { parse } = require('json2csv');
const directoryPath = 'CsvFiles/testData';
const folderPath = 'Attachment/Vitenam_passport';
const sendMail = require('./sendMail.js');
describe("Neutrinos IDP E2E Testing", function () {
    return __awaiter(this, void 0, void 0, function* () {
        after(function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("after loop executed");
            });
        });
        describe("End to End Testing", function () {
            return __awaiter(this, void 0, void 0, function* () {
                before(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        fs.readdir(folderPath, (err, files) => {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                FILES = files;
                                console.log(`Found ${FILES.length} files in ${folderPath}`);
                            }
                        });
                    });
                });
                it.only("Get an access token", () => __awaiter(this, void 0, void 0, function* () {
                    let sendReport = yield sendMail.sendCSVReport();
                    console.log(sendReport);
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
            });
        });
    });
});
