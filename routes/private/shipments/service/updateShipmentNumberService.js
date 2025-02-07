const getConnection = require('../../../../DataBase/getDataBaseConnection');
const {trackShipmentByNumber}=require('../../../public/service/shipmentTrackingService')
const sendEmail=require("../../../../helpers/nodeMailer")

async function updateShipmentNumber(shipmentNumber,shipmentId){

    try {
      var result=await trackShipmentByNumber(shipmentNumber)
      
      if(result.status=== "מספר משלוח לא תקין"){
        return {status:400,
          message:"מספר משלוח לא תקין"};
      }
        var connection=await getConnection()
        await connection.query('BEGIN')
        const query1  = {
            text: `UPDATE shipments
            SET shipment_number = $1 ,status=$3
            WHERE shipment_id=$2`,
            values: [shipmentNumber,shipmentId,result.status],
          }
          var temp = await connection.query(query1);
        if(temp.rowCount===1){

          const query2  = {
            text: `select sender_details.sender_email 
            from shipments
            join sender_details 
            on shipments.sender_id=sender_details.sender_id
            where shipments.shipment_number=$1`,
            values: [shipmentNumber],
          }
          var temp2 = await connection.query(query2);

          console.log(temp2.rows);
          var mailOption = {
            to: temp2.rows[0].sender_email,
            subject: 'מספר משלוח ',
            html: `<p> מספר משלוח שלך הוא ${shipmentNumber} תוכל לעשות מעקב עם המספר הזה באתר sprintcity</p>`
          };
         
          const flag= sendEmail(mailOption)
          if(flag){
            await connection.query('COMMIT')
            return {status:200,
              message:`נשלח קוד לאימןת ל תיבת הדואר שלך` }
          }else{
            await connection.query('ROLLBACK')
             return {status:400,
              message:"אירעה שגיאה "};
          }
        }
        } catch (error) {
          await connection.query('ROLLBACK')
         console.log(error);
         return {status:400,
          message:"אירעה שגיאה "};    }
          finally{
      if (connection) {
        connection.release();
      }
    }
  }
  
async function cancel_shipment(shipment_id){
  try {
      var connection=await getConnection()
      const query1  = {
          text: `UPDATE shipments
          SET cancel = CASE
          WHEN cancel = true THEN false
          ELSE true
          END
          WHERE shipment_id=$1`,
          values: [shipment_id],
        }
        var temp = await connection.query(query1);
      if(temp.rowCount===1){
          return {status:200,message:`בקשתך התקבלה בהצלחה`}
      }
      return {status:400,message:`אירעה שגיאה בטיפול בקשתך `}
    } catch (error) {
       console.log(error);
       return {status:400,message:`אירעה שגיאה בטיפול בקשתך `}
      }finally{
      if(connection){
          connection.release();
      }
  }
}

async function deleteOrderProcess(shipment_id,status){
  try {
    var msg;
    console.log('staatus',status);
    var connection=await getConnection()
    const query1  = {
      text: `select shipments.shipment_number ,sender_details.sender_email
       from shipments 
      join sender_details 
      on shipments.sender_id=sender_details.sender_id
      where shipments.shipment_id=$1`,
      values: [shipment_id],
    }
    var temp = await connection.query(query1);
    console.log(temp.rows);
    if(temp.rows.length==1){
      if(status){
       const re=await updateStatus(connection,shipment_id);
       if(re.status===400){
          return {status:400}
       }else{
        msg=`  ${temp.rows[0].shipment_number}משלוח שלך בוטל בהצלחה  `;
       }
      }else{
        msg=`<p>לא היה ניתן לבטל את המשלוח שלך בשלב זה , מספר משלוח ${temp.rows[0].shipment_number} </p>`;
      }
      var mailOption = {
        to: temp.rows[0].sender_email,
        subject: 'ביטול משלוח ',
        html: msg
      };
      console.log(mailOption);
      console.log(temp.rows[0]);
      const flag= sendEmail(mailOption)
      if(flag){
        return {status:200 }
      }else{
        console.log('1');
         return {status:400};
      }
    }else{
      console.log('2');

      return {status:400};

    }
  } catch (error) {
    console.log(error);
    return {status:400};

  }  finally{
    if (connection) {
      connection.release();
    }
  }

}
async function updateStatus(connection,shipment_id){
  try {
    console.log(shipment_id);
  const query1  = {
    text: `update shipments set status= $1 
    where shipment_id=$2 `,
    values: ['מבוטל',shipment_id],
  }
  var temp = await connection.query(query1);
  console.log(temp);
  console.log(temp.rowCount);
  if(temp.rowCount==1){
    return {status:200}
  }
  return {status:400}

  } catch (error) {
    return {status:400}

  }
}
  module.exports = {updateShipmentNumber,cancel_shipment,deleteOrderProcess};
