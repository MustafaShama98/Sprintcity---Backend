

const getConnection = require('../../../../DataBase/getDataBaseConnection');
async function getUserAddress(email){
    try {
        var connection=await getConnection()
        const query1  = {
            text: ` SELECT address.*
            FROM users
            RIGHT JOIN address
            ON address.id = users.address_id
            WHERE users.email=$1`,
            values: [email],
          }
          var temp = await connection.query(query1);
         return temp.rows[0];
        } catch (error) {
         console.log(error);
        return `somthing went wrong please try again22`
    }finally{
        connection.release();
    }
}
async function getUserInfo(){
    try {
        var connection=await getConnection()
        const query1  = {
            text: ` SELECT email,phone,first_name,last_name,customer_number,subscription,contract
            FROM users
            WHERE role='customer'`,
            values: [],
          }
          var temp = await connection.query(query1);
          
         return temp.rows;
        } catch (error) {
         console.log(error);
        return `somthing went wrong please try again22`
    }finally{
        connection.release();
    }
}

module.exports = {getUserAddress,getUserInfo};

