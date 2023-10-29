const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const nodemailer = require('nodemailer');

// Define common project ID
const projectID = 'sonar-jenkins';
const baseUrl = 'http://172.20.10.2:3000';

const urls = [
  `${baseUrl}/dashboard?id=${projectID}`,
  `${baseUrl}/project/issues?id=${projectID}&resolved=false`,
  `${baseUrl}/security_hotspots?id=${projectID}`,
  `${baseUrl}/component_measures?id=${projectID}`,
  `${baseUrl}/code?id=${projectID}`,
  `${baseUrl}/project/activity?id=${projectID}`,
];

async function captureWebPageAsPDF(page, url, pdfFileName) {
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.pdf({ path: pdfFileName, format: 'A4' });
}

async function mergePDFs(pdfFiles, mergedPDFFileName) {
  const mergedPDF = await PDFDocument.create();

  for (const pdfFile of pdfFiles) {
    const pdfBytes = fs.readFileSync(pdfFile);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());

    for (const page of copiedPages) {
      mergedPDF.addPage(page);
    }
  }

  const mergedPDFBytes = await mergedPDF.save();
  fs.writeFileSync(mergedPDFFileName, mergedPDFBytes);
}

(async () => {
  const browser = await puppeteer.launch({   headless: 'new', 
    args: ['--no-sandbox', '--disable-gpu', '--enable-webgl', '--window-size=800,800'] 
  });
  const page = await browser.newPage();
  
  // Log in only once
  await page.goto(`${baseUrl}/sessions/new?return_to=%2Fprojects`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="login"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="login"]', 'admin');
  await page.type('input[name="password"]', 'admin1');
  await page.click('button[type="submit"]');
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const pdfFiles = [];

  for (let i = 0; i < urls.length; i++) {
    const pdfFileName = `page_${i}.pdf`;
    pdfFiles.push(pdfFileName);
    await captureWebPageAsPDF(page, urls[i], pdfFileName);
  }

  await mergePDFs(pdfFiles, 'merged.pdf');

  // Delete individual PDFs
  pdfFiles.forEach((pdfFile) => fs.unlinkSync(pdfFile));

  // Close the browser after all operations
  await browser.close();

  // Send the merged PDF as an email attachment
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'soumya.gowda@neutrinos.co',
      pass: 'P@sword135055',
    },
  });

  const mailOptions = {
    from: 'soumya.gowda@neutrinos.co',
    to: 'soumya.gowda@neutrinos.co',
    subject: 'SonarQube Test Report',
    text: 'Please find the sonarQube Report',
    attachments: [
      {
        filename: `${projectID}.pdf`,
        path: 'merged.pdf',
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Email could not be sent:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
})();
