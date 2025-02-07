const {makeAPICallrunERP}=require('../../../../helpers/apiCalls')
const xml2js = require('xml2js');
const {generateShipmentURL,errorTable}=require("../../../../helpers/shipmentParamsGenerator");
const getConnection = require('../../../../DataBase/getDataBaseConnection');
const {trackShipmentByNumber}=require('../../../public/service/shipmentTrackingService.js')

async function shipmentCreateAndSave(req){
    try {
        var sender_id;
        var recipient_id;
        var sender_phone2;
        var recipient_phone2;
        // var url=await generateShipmentURL(req)
        // var xmlResponse=await makeAPICallrunERP(url);
        // var jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
        // console.log(jsonObject.root.mydata[0].answer[0]);
        // if(jsonObject.root.mydata[0].answer[0].ship_create_num[0]=='0'){
        //     const err=errorTable(jsonObject.root.mydata[0].answer[0].ship_create_error_code[0])
        //     return {status:400,message:err,recipient_phone:req.recipient_phone};
        // }
        var connection=await getConnection()
        const {recipient_name,recipient_email,recipient_phone,recipient_city,recipient_floor,recipient_building,
            recipient_street,recipient_enterance,recipient_appartment,recipient_address_notes}=req;
            const {sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
              sender_street,sender_enterance,sender_appartment,sender_address_notes}=req;
        try {
            await connection.query('BEGIN')
            
          if(req.shipment_purpose==='איסוף'){
            const query4  = {
              text: `INSERT into recipient_details (recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                   recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING recipient_id`,
                   values: [sender_name,sender_email,sender_phone,sender_city,sender_street,sender_building,
                    sender_enterance,sender_floor,sender_appartment,sender_address_notes],
            }
          const result=await connection.query(query4);
          recipient_id=result.rows[0].recipient_id;
            const query5 = {
              text: `INSERT into sender_details (sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING sender_id`,
                values: [recipient_name, recipient_email, recipient_phone, recipient_city, recipient_floor,
                  recipient_building, recipient_street, recipient_enterance, recipient_appartment, recipient_address_notes],
            }
          const senderresult=await connection.query(query5);
          sender_id =senderresult.rows[0].sender_id;
           sender_phone2=recipient_phone;
           recipient_phone2=sender_phone;

          }else{
            const query1  = {
              text: `INSERT into recipient_details (recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                   recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING recipient_id`,
              values: [recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                  recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes],
            }
          const result=await connection.query(query1);
             recipient_id=result.rows[0].recipient_id;

            const query3 = {
              text: `INSERT into sender_details (sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING sender_id`,
              values: [sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes],
            }
          const senderresult=await connection.query(query3);
           sender_id=senderresult.rows[0].sender_id;
           
           sender_phone2=sender_phone;
           recipient_phone2=recipient_phone;
          }

            const { shipment_purpose, packages_number,  payment_type, payment_sum, payment_date,payment_collection_notes,num_of_returned}=req;
              
                // const shipment_number=jsonObject.root.mydata[0].answer[0].ship_create_num[0];
                // const shipment_rand_number=jsonObject.root.mydata[0].answer[0].ship_num_rand[0];
                const shipment_number = Math.floor(Math.random() * 100);
                const shipment_rand_number=Math.floor(Math.random() * 100);
                const order_time=getCurrentTime();
                const order_date=getCurrentDate();
                const track=await trackShipmentByNumber(shipment_number)
                //const shipment_type=req.shipment_type==140 ? 'עד הבית' : 'עד נקודת שירות'
                const shipment_type=req.shipment_cargo

            const query2  = {
                        text: `INSERT into shipments ( shipment_purpose, packages_number, status, shipment_number, shipment_rand_number,payment_code, payment_sum, payment_date, payment_collection_notes, sender_phone,recipient_phone,
                  recipient_id,sender_id,order_time,order_date,shipment_type,num_of_returned,cancel)
                 values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING shipment_number`,
                values: [ shipment_purpose, packages_number, track.status,shipment_number , shipment_rand_number
                , payment_type, payment_sum, payment_date, payment_collection_notes,
                sender_phone2,recipient_phone2, recipient_id,sender_id,order_time,order_date,shipment_type,num_of_returned,'false'],
              }
              var shipment=await connection.query(query2);
              console.log(shipment.rows);

            await connection.query('COMMIT')
          } catch (e) {
            console.log(e);
            await connection.query('ROLLBACK')
          } finally {
            connection.release();
        }
        
      return {status:200,message:`הזמנתך נקלטה בהצלחה`,recipient_phone:req}
        } catch (error) {
            console.log(error);
            const err=errorTable("0")
            return {status:400,message:err,recipient_phone:req};
        }
}


function getCurrentDate() {
  var today = new Date();

  return (
    today.getFullYear()+
   `/` +
    (today.getMonth() + 1 < 10 ? "0" : "") +
    (today.getMonth() + 1) +
   `/` +
    (today.getDate() < 10 ? "0" : "") +
    today.getDate() 
  );
}
function getCurrentTime() {
  var today = new Date();

  return (
    (today.getHours() < 10 ? "0" : "") +
    today.getHours() +
    ":" +
    (today.getMinutes() < 10 ? "0" : "") +
    today.getMinutes()+ ":" +
    (today.getSeconds() < 10 ? "0" : "") +
    today.getSeconds()
  );
}
async function shipmentSaveNotPremium(req){
  try {
      var connection=await getConnection()
      const {recipient_name,recipient_email,recipient_phone,recipient_city,recipient_floor,recipient_building,
            recipient_street,recipient_enterance,recipient_appartment,recipient_address_notes}=req;
      const {sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
             sender_street,sender_enterance,sender_appartment,sender_address_notes}=req;

      try {
          await connection.query('BEGIN')
          var sender_id;
          var recipient_id;
          var sender_phone2;
          var recipient_phone2;
          if(req.shipment_purpose==='איסוף'){
            const query4  = {
              text: `INSERT into recipient_details (recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                   recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING recipient_id`,
                   values: [sender_name,sender_email,sender_phone,sender_city,sender_street,sender_building,
                    sender_enterance,sender_floor,sender_appartment,sender_address_notes],
                  
            }
          const result=await connection.query(query4);
          recipient_id =result.rows[0].recipient_id;
             
            const query5 = {
              text: `INSERT into sender_details (sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING sender_id`,
                values: [recipient_name, recipient_email, recipient_phone, recipient_city, recipient_floor,
                  recipient_building, recipient_street, recipient_enterance, recipient_appartment, recipient_address_notes],
            }
          const senderresult=await connection.query(query5);
          sender_id=senderresult.rows[0].sender_id;
           sender_phone2=recipient_phone;
           recipient_phone2=sender_phone;

          }else{
            const query1  = {
              text: `INSERT into recipient_details (recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                   recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING recipient_id`,
              values: [recipient_name, recipient_email, recipient_phone, recipient_city, recipient_street,
                  recipient_building, recipient_enterance, recipient_floor, recipient_appartment, recipient_address_notes],
            }
          const result=await connection.query(query1);
             recipient_id=result.rows[0].recipient_id;

            const query3 = {
              text: `INSERT into sender_details (sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING sender_id`,
              values: [sender_name,sender_email,sender_phone,sender_city,sender_floor,sender_building,
                sender_street,sender_enterance,sender_appartment,sender_address_notes],
            }
          const senderresult=await connection.query(query3);
           sender_id=senderresult.rows[0].sender_id;
           sender_phone2=sender_phone;
           recipient_phone2=recipient_phone;

          }

          const { shipment_purpose, packages_number,payment_type, 
            payment_sum, payment_date,payment_collection_notes,num_of_returned}=req;
              const time=getCurrentTime();
              const date=getCurrentDate()
              const shipment_type=req.shipment_cargo
              
          const query3  = {
                      text: `INSERT into shipments ( shipment_purpose, packages_number, status, payment_code, payment_sum, payment_date, payment_collection_notes,
                 recipient_id,order_time,order_date,sender_id,sender_phone,recipient_phone,shipment_type,num_of_returned,cancel)
               values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING shipment_number`,
              values: [ shipment_purpose, packages_number, "בתהליך ביצוע",  payment_type, payment_sum, 
               payment_date, payment_collection_notes, recipient_id,time,date,sender_id,sender_phone2,
               recipient_phone2,shipment_type,num_of_returned,'false'],
            }
            var shipment=await connection.query(query3);
          
          await connection.query('COMMIT')
        } catch (e) {
          await connection.query('ROLLBACK')
          console.log(e);
          const err=errorTable("0")
          return {status:400,message:err,recipient_phone:req}
        } finally {
          connection.release();
      }
      
      return {status:200,message:`הזמנתך נקלטה בהצלחה`,recipient_phone:req}
      } catch (error) {
          console.log(error);
          const err=errorTable("0")
          return {status:400,message:err,recipient_phone:req}
      }
}
async function updateCost(email,cost,amount){
  var connection=await getConnection()

  try {
    await connection.query('BEGIN')

    const query1  = {
        text: `SELECT *
        FROM accounting
        WHERE email = $1
          AND EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM date)
          AND EXTRACT(YEAR FROM CURRENT_DATE) = EXTRACT(YEAR FROM date);
        `,
        values: [email],
      }
      var res1 = await connection.query(query1);
      if(res1.rows.length===1){
        
        var totalCost = parseInt(res1.rows[0].total_cost, 10);
        var totalAmount = parseInt(res1.rows[0].amount, 10);
        var newCost=totalCost+cost;
        var newAmount=totalAmount+amount;
      
        const query2  = {
          text: `UPDATE accounting 
          SET total_cost=$2,amount=$3 
          WHERE email = $1
          AND EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM date)
          AND EXTRACT(YEAR FROM CURRENT_DATE) = EXTRACT(YEAR FROM date);`,
          values: [email,newCost,newAmount],
        }
        var res2 = await connection.query(query2);

      }else{
        const query3  = {
          text: `INSERT INTO accounting (email,date,total_cost,amount)
          VALUES ($1,CURRENT_DATE,$2,$3);`,
          values: [email,cost,amount],
        }
        var res3 = await connection.query(query3);
      }
      await connection.query('COMMIT')
      return {status:200,message:'success'}
    } catch (error) {
      await connection.query('ROLLBACK')
     console.log(error);
    return  {status:400,message:'failed'}

}finally{
    connection.release();
}
}
module.exports = {shipmentCreateAndSave,shipmentSaveNotPremium,updateCost};
