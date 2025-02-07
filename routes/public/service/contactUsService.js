
const sendEmail=require("../../../helpers/nodeMailer")


async function contactUsService(data){
    const mailOption={
        //change to info@sprintcity.co.il
        to:'msa.vetc@gmail.com',
        subject:'צור קשר',
        html:`<p> <b>שם:</b> ${data.name} <br> 
               <b>אימייל:</b> ${data.email} <br> 
               <b>טלפון:</b> ${data.number} <br> 
               <b>הודעה:</b> ${data.body} <br> 
            </p>`
      }
      const flag=sendEmail(mailOption)
      if(flag){
        return {status:200,
          message:`נשלח קוד לאימןת ל תיבת הדואר שלך` }
      }else{
        return {status:400,
          message:"אירעה שגיאה "};
      }
    
  }


  module.exports = contactUsService;

