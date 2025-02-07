const NodeCache = require('node-cache');
const sendEmail=require("./nodeMailer")
const OTPcash = new NodeCache({ stdTTL: 900, checkperiod: 1000 });

//save the OTP in the cash
async function setNewOtp(email,OTP){
    OTPcash.set(email,OTP)
    console.log(`new OTP   ${OTPcash.get(email)}`);
}

//verify the OTP
async function verifyOtp(email,OTP){
    console.log(`OTP IS ${OTP}`);
    const old=OTPcash.get(email);
    console.log(old);
    if(old===undefined){
        return {
            status:401,
            message:`the code timeout`
        }
    } 

    if (old!=OTP) return {
        status:400,
        message:`incorrect code`
    };else{
        return {
            status:200,
            message:`you'r email has been verified`
        }
    }

}

//generate,save and send the OTP 
async function generateOTP(email){
    const OTP=Math.floor(1000+Math.random()*9000);
    const mailOption={
      to:email,
      subject:'Verify Your Email',
      html:`<p>Enter  <b>${OTP}</b> in the website to verify you'r email
      this code expires in <b>15 minutes</b></p>`
    }
    const flag=sendEmail(mailOption)
    if(flag){
      setNewOtp(email,OTP);
      return {status:200,
        message:`נשלח קוד לאימןת ל תיבת הדואר שלך` }
    }
    return {status:400,
        message:"אירעה שגיאה "};
  }
  

module.exports = {verifyOtp,setNewOtp,generateOTP};