var nodemailer = require('nodemailer');
require("dotenv").config({path:'../.env'});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.emailpass
    }
  });
  
  var mailOptions2 = {
    from: process.env.email,
    to: 'msa.vetc@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
 async function sendEmail(mailOptions){
    mailOptions.from=process.env.email;
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('succsess');
          return true;
        }
      });
    
 }
 

 module.exports =sendEmail;
