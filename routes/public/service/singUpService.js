const bcryptjs = require("bcryptjs");
const {generateOTP} = require('../../../helpers/nodeCashOTP');

const getConnection=require("../../../DataBase/getDataBaseConnection")
async function signup(req) {
  //const { senderPassword, email, firstName, lastName, phoneNumber,subscription } =req.body.user;
 // const {street,city,houseNumber,houseRow,zip,houseEntry,address_notes}=req.body.address;
  const { senderPassword, email, firstName, lastName, phoneNumber,subscription } =req.body.data;
  const {street,city,houseNumber,houseRow,zip,houseEntry,address_notes}=req.body.data;
  try {
    var connection = await getConnection();
    await connection.query('BEGIN')

        const query1 = {
          text: 'SELECT * FROM users WHERE email=$1',
          values: [email],
        }
        var userExist = await connection.query(query1);
    
      if(userExist.rows.length===1) return {status:"failed",
      message:"ה אימיל כבר קיים במערכת "      
};
/**
 *   const query2 = {
            text: 'INSERT into address (street,city,building,floor,apartment,entrance,address_notes) values($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values: [street,city,building,floor,apartment,entrance,address_notes],
          }
        var addressid = await connection.query(query2);
         const encpass=await encryptedPassword(password)
        const query3 = {
            text: 'INSERT into users (password, email, first_name, last_name, phone,address_id,role,subscription,is_verified) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            values: [encpass, email, first_name, last_name, phone, addressid.rows[0].id,"customer",subscription,0],
          }
 */
        const query2 = {
            text: 'INSERT into address (street,city,building,floor,apartment,entrance,address_notes) values($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values: [street,city,houseNumber,houseRow,zip,houseEntry,address_notes],
          }
        var addressid = await connection.query(query2);
         const encpass=await encryptedPassword(senderPassword)
        const query3 = {
            text: 'INSERT into users (password, email, first_name, last_name, phone,address_id,role,subscription,is_verified,password_reset,contract) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
            values: [encpass, email, firstName, lastName, phoneNumber, addressid.rows[0].id,"customer",subscription,0,0,'false'],
          }
        const res = await connection.query(query3);
        await connection.query('COMMIT')
  } catch (e) {
    await connection.query('ROLLBACK')
    console.log(e);
    return {succsses:false,
        message:"אירעה שגיאה "      
  };
  } finally {
    if(connection){
      connection.release();
    }
}

    await generateOTP(email);

return {succsses:true,
message:"הרשמתך ל sprintcity בוצעה בהצלחה"      
};

}

async function encryptedPassword(password) {
  const salt = await bcryptjs.genSalt(8);
  const encryptedPassword = await bcryptjs.hash(password, salt);
  return encryptedPassword;
}

module.exports = signup;
