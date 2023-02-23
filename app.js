const express = require("express");
const app = express();
const fs = require('fs');
var http = require('http').Server(app);
const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nodemailer = require('nodemailer');
app.listen(4000);

app.get('/ping', (req, res) => {
  res.send("server is up")
})
app.get('/api/idp_api_testing', async (req, res) => {
  let hostUrl = req.protocol + '://' + req.get('host'); //To-do
  let cmdExec = new Execution();
  cmdExec.execCommand('npm run IDPTesting', function (returnvalue) {
  getReportData(returnvalue);
  res.send("Executing IDP API's")
  });
});


app.get('/api/similarityTesting', async (req, res) => {
  let cmdExec = new Execution();
  cmdExec.execCommand('npm run E2E', function () {
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

  let reportData = getReport(executionData);

  // Build HTML table
  let htmlTable = '<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; color: black; background-color: white;">';
  htmlTable += '<tr><th colspan="2" style="background-color: black; color: white; padding: 15px;">Neutrinos Intelligent Document Processing APIs Test Report Summary</th></tr>';
  for (let i = 0; i < reportData.length; i++) {
    if (typeof reportData[i] === 'object') {
      for (const [key, value] of Object.entries(reportData[i])) {
        htmlTable += `<tr style="background-color: black; color: white;"><td style="padding: 10px;">${key}</td><td style="padding: 10px;">${value}</td></tr>`;
      }
    } else {
      htmlTable += `<tr style="background-color: black; color: white;"><td colspan="2" style="padding: 10px;"><a href="${reportData[i]}" style="color: white; text-decoration: none;">Test Report Link</a></td></tr>`;
    }
  }
  htmlTable += '</table>';

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'soumya.gowda@neutrinos.co',
      pass: 'P@sword4'  
    }
  });

  // Send mail
  const mailOptions = {
    from: 'soumya.gowda@neutrinos.co',
    to: 'soumya.gowda@neutrinos.co',
    subject: 'Test Report Summary-Neutrinos Intelligent Document Processing',
    html: htmlTable
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

        }
      }
    }
  }
  console.log("ReportData......", reportData)
  return reportData;
}







