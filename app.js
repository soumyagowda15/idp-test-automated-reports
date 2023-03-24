const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path')
var http = require('http').Server(app);
const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nodemailer = require('nodemailer');
app.listen(4000);
const configData = require('./ConfigurationTestData/config/test_Config');
const gitPages = require('./reportGitCommands')
const reportDirectoyPath = './Reporting';


app.get('/ping', (req, res) => {
  res.send("server is up")
})


app.get('/api/idp_api_testing-prod', async (req, res) => {
  deleteFilesInDirectory(reportDirectoyPath); // delete the previous execution reports from the Reporting Directory.
  let cmdExec = new Execution();
  cmdExec.execCommand('npm run IDPTesting-prod', async function (returnvalue) {
    await gitPages.copyReportToGithub(); // Copy the Reports from Reporting Directory to the Github Repo
    getReportData(returnvalue);
    res.send("Executing IDP API's")
  });
});


app.get('/api/similarityTesting-prod', async (req, res) => {
  let cmdExec = new Execution();
  cmdExec.execCommand('npm run E2E-prod', function () {
    // getReportData();   // change sendmail to send csv files
    res.send("Executing E2E API's")
  });
});



function Execution() {
  this.execCommand = function (cmd, callback) {
    let testName = cmd.split(" ");
    console.log(testName[testName.length - 1] + " execution started");
    child_process.exec(cmd, (err, stdout, stderr) => {
      callback(stdout)
    })
  }
}

function getReportData(executionData) {
  let testCases = [];
  let reportData = getReport(executionData);
  // Build HTML table
  let htmlTable = '<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; color: black; background-color: white;">';
  htmlTable += '<tr><th colspan="2" style="background-color: black; color: white; padding: 15px;">' + reportData[0] + '</th></tr>';
  let reportLink = reportData[3]; // Store report link in variable
  testCases[0] = `Total Test Cases:${reportData[1].tests}<br />`
  testCases[1] = `Total passed test cases:${reportData[1].passes}<br />`
  testCases[2] = `Total failed test cases:${reportData[1].failures}<br />`
  const jsonReportData = reportData[1]; // Get the object containing the report data
  htmlTable += `<tr><td colspan="2" style="text-align: center; padding: 10px;"></td></tr>`;
  for (const [key, value] of Object.entries(jsonReportData)) {
    htmlTable += `<tr><td style="padding: 10px;">${key}</td><td style="padding: 10px;">${value}</td></tr>`;
  }
  htmlTable += '</table>';
  let html = `Hi,<br /><h3>Test Case Summary</h3>${testCases[0]}${testCases[1]}${testCases[2]}<br />Please find the link for the automation Reports  <a href="${reportLink}">Click here for the detailed test report</a><br /><br /> ${htmlTable}<br />Thanks,<br />IDP Automation Team`;
  sendMail(html);

}

function sendMail(html) {
  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: configData.MAIL_AUTHORIZATION
  });

  // Send mail
  const mailOptions = {
    from: configData.MAIL_FROM,
    to: configData.MAIL_TO,
    subject: 'Test Report Summary of Neutrinos Intelligent Document Processing',
    html: html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
}


function getReport(executionData) {
  let reportData = [];
  // Execution Data includes both html and json url's
  executionData = executionData.split("\n");
  for (let execeutionDataCount = 0; execeutionDataCount < executionData.length; execeutionDataCount++) {
    if (executionData[execeutionDataCount].includes(".json") || executionData[execeutionDataCount].includes(".html")) {
      let htmlJsonData = executionData[execeutionDataCount].split("saved to");
      console.log("saved to data", htmlJsonData);
      for (let htmlJsonDataCount = 0; htmlJsonDataCount < htmlJsonData.length; htmlJsonDataCount++) {
        console.log("htmlJsonData[htmlJsonDataCount]", htmlJsonData[htmlJsonDataCount]);

        //json report includes passed,failed,skipped test cases, Title
        if (htmlJsonData[htmlJsonDataCount].includes('.json')) {
          console.log("JSON Report is saved in path: " + htmlJsonData[htmlJsonDataCount]);
          let fileData = JSON.parse(fs.readFileSync(htmlJsonData[htmlJsonDataCount].trim(), 'utf8'));
          reportData.push(fileData["results"][0]["suites"][0]["title"]);
          reportData.push(fileData["stats"]);

          // fetch html report url
        } else if (htmlJsonData[htmlJsonDataCount].includes('.html')) {
          reportData.push(htmlJsonData[htmlJsonDataCount].trim());
          let htmlFileName = htmlJsonData[htmlJsonDataCount].substring(htmlJsonData[htmlJsonDataCount].lastIndexOf("\\") + 1);
          htmlFileName = htmlFileName.replace(/\+/g, "%2B");
          const htmlReportUrl = `https://soumyagowda15.github.io/idp-test-automated-reports/${htmlFileName}`;
          console.log(htmlReportUrl);
          reportData.push(htmlReportUrl)
        }
      }
    }
  }
  console.log("ReportData......", reportData)
  return reportData;
}

//Delete the Reports in the Reporting Directory 
function deleteFilesInDirectory(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err)
      throw err;

    if (files.length === 0) {
      console.log(`Directory is empty: ${dirPath}`);
      return;
    }
    files.forEach(file => {
      console.log("dirPath", dirPath)
      console.log("filePath", `${dirPath}/${file}`)
      const filePath = `${dirPath}/${file}`;

      fs.stat(filePath, (err, stat) => {
        if (err) throw err;

        if (stat.isFile()) {
          fs.unlink(filePath, err => {
            if (err) throw err;

            console.log(`Deleted file: ${filePath}`);
          });
        } else if (stat.isDirectory()) {
          console.log(`Skipping directory: ${filePath}`);
        }
      });
    });
  });

}