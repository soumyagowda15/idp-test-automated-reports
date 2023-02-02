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
const documentProcessing_1 = require("../../E2E/testE2E/documentProcessing");
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
var ACCESS_TOKEN, JOB_ID, FILE_ID;
var document_label;
describe("test", function () {
    return __awaiter(this, void 0, void 0, function* () {
        it("Get Job Document Result", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let documentResults = yield genericMethods.mongoDBDataFetch("document", { "document_label": "PASSPORT" }, '');
                var doc_id = documentResults[0].docid;
                let EngineResultField = yield genericMethods.mongoDBDataFetch("transformed_engine_result", { "file_id": "63118acd9372ee0037602c74" }, '');
                let documentFieldResults = documentResults[0]["rules"]["form_fields"];
                console.log(documentFieldResults);
                let a = new documentProcessing_1.TestEngineResult(EngineResultField, documentFieldResults);
                a.validateFormField(documentFieldResults, EngineResultField[0]["form_fields"]);
            });
        });
    });
});
