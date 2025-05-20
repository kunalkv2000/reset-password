// scripts/genEthereal.js
import nodemailer from "nodemailer";

async function makeTestAcct() {
  let testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal SMTP credentials:");
  console.log("ETHEREAL_HOST=", testAccount.smtp.host);
  console.log("ETHEREAL_PORT=", testAccount.smtp.port);
  console.log("ETHEREAL_SECURE=", testAccount.smtp.secure);
  console.log("ETHEREAL_USER=", testAccount.user);
  console.log("ETHEREAL_PASS=", testAccount.pass);
  console.log("EMAIL_FROM=yourname@ethereal.email");
}
makeTestAcct();
