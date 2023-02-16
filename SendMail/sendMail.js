const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "soumya.gowda@neutrinos.co",
    pass: "P@sword4",
  },
});
//some data
async function sendmail()
{


transporter.sendMail(
  {
    from: "soumya.gowda@neutrinos.co",
    to: "soumya.gowda@neutrinos.co",
    subject: "You need to know the truth",
    text: "Ola! Please check the attachment for a surprise 😊",
    html: "<b>Ola! Please check the attachment for a surprise! 😊</b>",
		//here is the magic
    attachments: [
        
      {
        filename: "./CsvFiles/testData/412d4be8-930f-4a5e-8503-bd46a1765bce.csv",
        content: "csv",
      },
    ],
  },
  (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
);
}
sendmail()