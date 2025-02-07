const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getConnection=require("../../../DataBase/getDataBaseConnection")
const {verifyOtp,generateOTP}=require("../../../helpers/nodeCashOTP")

async function login(req) {
  try {

    const {email,password} = req.body;
  
    var connection = await getConnection();
    try {
      const query = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [email],
      }
      var userExist = await connection.query(query);
    } catch (error) {
      
      console.error('Error executing a query:', error);
     return {status:500};
    } finally {
      connection.release();

    }

    if (userExist.rows.length===0) return {status:411};
  
    const pass = userExist.rows[0].password;
    const isMatch = await bcryptjs.compare(password, pass);
    if (!isMatch) return {status:411};


   
    if(userExist.rows[0].is_verified==0){
      return {status:410}
     }else{
      const tokenPayload = {
        first_name: userExist.rows[0].first_name,
        last_name: userExist.rows[0].last_name,
        email: userExist.rows[0].email,
        role: userExist.rows[0].role,
        phone: userExist.rows[0].phone,
        address:userExist.rows[0].address,
        subscription:userExist.rows[0].subscription,
        customer_number:userExist.rows[0].customer_number
      };
  
      const JWTtoken = jwt.sign(tokenPayload, process.env.JWT_SECRET);
      const user={
        email: userExist.rows[0].email,
        contract:userExist.rows[0].contract,
        role: userExist.rows[0].role,
        phone: userExist.rows[0].phone,
        first_name: userExist.rows[0].first_name,
        last_name: userExist.rows[0].last_name,
        subscription:userExist.rows[0].subscription,
      }
      return {status:200,user, accessToken: JWTtoken}

     }
  } catch (error) {
    console.log(error);
    return {status:500}
   
  }
}


async function verifyOTPforEmail(email,OTP){
  const result=await verifyOtp(email,OTP);
  console.log(result);
  if(result.status===200){
    try {
      var connection=await getConnection()
      const query1  = {
          text: `UPDATE users
          SET is_verified = $1
          WHERE email=$2`,
          values: [1,email],
        }
        var temp = await connection.query(query1);
      if(temp.rowCount===1){
          return {status:200,message:`you'r email has been verified`}
      }
        return {status:500,message:`somthing went wrong please try again`}
      } catch (error) {
       console.log(error);
      return {status:500}
    }finally{
      if(connection){
          connection.release();
      }
  }
  }
  return result
}



async function resendOTP(email){
 const result=await generateOTP(email)
 return result;
}




module.exports = {login,verifyOTPforEmail,resendOTP};
