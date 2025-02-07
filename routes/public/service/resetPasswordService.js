const {verifyOtp,generateOTP}=require("../../../helpers/nodeCashOTP")
const bcryptjs = require("bcryptjs");
const getConnection=require("../../../DataBase/getDataBaseConnection")


async function resetPassword(email,password){
  
    var connection = await getConnection();
    try {
        await connection.query('BEGIN')
        const encpass=await encryptedPassword(password)
        const query = {
        text: 'SELECT password_reset FROM users WHERE email=$1',
        values: [email],
      }
      var userExist = await connection.query(query);
      console.log(userExist.rows[0]);
      console.log(encpass);
      if(userExist.rows[0].password_reset==1){
        const query2 = {
            text: 'UPDATE users SET password_reset=$1, password=$2 WHERE email=$3',
            values: [0,encpass,email],
          }
       await connection.query(query2);
      }
      else{
        return {status:500};
      }
      await connection.query('COMMIT')

    } catch (error) {
        await connection.query('ROLLBACK')
      console.error('Error executing a query:', error);
      return {status:500};
    } finally {
        if(connection){
            connection.release();
          }
    }
    return {status:200};
}
async function sendOTP(email){
  try {
    var connection=await getConnection()
    const query1  = {
        text: `SELECT * FROM users WHERE email=$1`,
        values: [email],
      }
      var temp = await connection.query(query1);
    if(temp.rows.length===0){
        return {status:400,message:'email do not exist'}
    }else{
      const result=await generateOTP(email);
      return result
    }
    } catch (error) {
     console.log(error);
    return {status:500}
  }finally{
    if(connection){
        connection.release();
    }
}
}
async function encryptedPassword(password2) {
  console.log(`from becrypt    ${password2}`);
    const salt = await bcryptjs.genSalt(8);
    const encryptedPassword = await bcryptjs.hash(password2, salt);
    return encryptedPassword;
  }



  async function verifyOTPforPassword(email,OTP){
    const result=await verifyOtp(email,OTP);
    console.log(result);
    if(result.status===200){
      try {
        var connection=await getConnection()
        const query1  = {
            text: `UPDATE users
            SET password_reset = $1
            WHERE email=$2`,
            values: [1,email],
          }
          var temp = await connection.query(query1);
        if(temp.rowCount===1){
            return {status:200}
        }
          return {status:500}
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
  
  
  
  
  module.exports = {resetPassword,sendOTP,verifyOTPforPassword};
  