const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const { parse } = require('json2csv');
directoryPath = 'D:/IDP_Automation/idp-automated-tests/CsvFiles/testData'
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'soumya.gowda@neutrinos.co',
    pass: 'P@sword4'
  }
});

module.exports={


 sendCSVReport: async(directoryPath) =>{
  return new Promise((resolve, reject) => {
    const htmlTables = [];
    const attachments = [];

    // Read the CSV files in the directory
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log('Unable to scan directory: ' + err);
        reject(err);
      }

      // Loop through each CSV file
      files.forEach((fileName, index) => {
        const csvFilePath = `${directoryPath}/${fileName}`;
        const rows = [];

        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            rows.push(row);
          })
          .on('end', () => {
            // Convert the CSV data to an HTML table
            const htmlTable = `<h3>Document ${index + 1}: ${fileName}</h3><table>${rows
              .map((row) => `<tr>${Object.values(row)
                .map((value) => `<td>${value}</td>`)
                .join('')}</tr>`)
              .join('')}</table>`;
            htmlTables.push(htmlTable);

            // Convert the CSV data to JSON for attaching to the email
            const json = rows.map((row) => Object.assign({}, row));
            const csvData = parse(json, { fields: Object.keys(rows[0]), fileName });

            // Add the attachment to the attachments array
            attachments.push({
              filename: fileName,
              content: csvData
            });

            // If all the files have been processed, send the email
            if (attachments.length === files.length) {
              // Join the HTML tables into a single string
              const html = htmlTables.join('');

              // Setup the email message
              const mailOptions = {
                from: 'soumya.gowda@neutrinos.co',
                to: 'soumya.gowda@neutrinos.co',
                subject: 'Neutrinos IDp CSV Report',
                html,
                attachments
              };

              // Send the email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  console.log('Email sent');
                  resolve();
                }
              });
            }
          });
      });
    });
  });
}
}