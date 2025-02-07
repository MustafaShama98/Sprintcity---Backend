

const getConnection = require('../../../../DataBase/getDataBaseConnection');
async function updateUserCustomerNumber(customer_number,email){
    try {
        var connection=await getConnection()
        const query1  = {
            text: `UPDATE users
            SET customer_number = $1
            WHERE email=$2`,
            values: [customer_number,email],
          }
          var temp = await connection.query(query1);
        if(temp.rowCount===1){
            return `מספר לקןח עודכן בהצלחה`
        }
          return `somthing went wrong please try again`
        } catch (error) {
         console.log(error);
        return `somthing went wrong please try again22`
    }finally{
        if(connection){

            connection.release();
        }
    }
}

async function verifyUserPremium(email){
    try {
        var connection=await getConnection()
        var contract=true;
        const query1  = {
            text: `UPDATE users
            SET contract = $1
            WHERE email=$2`,
            values: [contract,email],
          }
          var temp = await connection.query(query1);
        if(temp.rowCount===1){
            return `מספר לקןח עודכן בהצלחה`
        }
          return `somthing went wrong please try again`
        } catch (error) {
         console.log(error);
        return `somthing went wrong please try again22`
    }finally{
        if(connection){

            connection.release();
        }
    }
}

module.exports = {updateUserCustomerNumber,verifyUserPremium};
