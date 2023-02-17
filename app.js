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
app.get('/api/IDP_API_Testing', async (req, res) => {
    let hostUrl = req.protocol + '://' + req.get('host');
    let cmdExec = new Execution();
    cmdExec.execCommand('npm run IDPTesting', function (returnvalue) {
        getReportData(returnvalue, "All Test Cases", hostUrl);
        res.send("Executing IDP API's")
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

function getReportData(executionData, strTestCaseName, strHostIPAddress) {
    
    let arrayData = getReport(executionData);
    
    // Build HTML table
let htmlTable = '<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; color: black; background-color: white;">';
htmlTable += '<tr><th colspan="2" style="background-color: black; color: white; padding: 15px;">Neutrinos Intelligent Document Processing APIs Test Report Summary</th></tr>';
for (let i = 0; i < arrayData.length; i++) {
  if (typeof arrayData[i] === 'object') {
    for (const [key, value] of Object.entries(arrayData[i])) {
      htmlTable += `<tr style="background-color: black; color: white;"><td style="padding: 10px;">${key}</td><td style="padding: 10px;">${value}</td></tr>`;
    }
  } else {
    htmlTable += `<tr style="background-color: black; color: white;"><td colspan="2" style="padding: 10px;"><a href="${arrayData[i]}" style="color: white; text-decoration: none;">Test Report Link</a></td></tr>`;
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
  subject: 'Test Report Summary',
  html: htmlTable
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}


function getReport(strData) {
    let arrayData = [];
    strData = strData.split("\n");
    for (let i = 0; i < strData.length; i++) {
        if (strData[i].includes(".json") || strData[i].includes(".html")) {
            let data = strData[i].split("saved to");
            console.log("saved to data", data);
            for (let j = 0; j < data.length; j++) {
                console.log("data[j]", data[j]);
                if (data[j].includes('.json')) {
                    console.log("JSON Report is saved in path: " + data[j]);
                    let fileData = fs.readFileSync(data[j].trim(), 'utf8');
                    let jsonData = JSON.parse(fileData);
                    arrayData.push(jsonData["results"][0]["suites"][0]["title"]);
                    arrayData.push(jsonData["stats"]);

                } else if (data[j].includes('.html')) {
                    arrayData.push(data[j].trim());

                }
            }
        }
    }
    console.log("arrayData", arrayData)
    return arrayData;
}







