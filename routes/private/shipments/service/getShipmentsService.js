
const getConnection=require("../../../../DataBase/getDataBaseConnection")
async function getShipmentsByPhone(phone) {
  var arr=[]
    try {
  
        var connection=await getConnection()
        const query = {
        text:`select shipments.shipment_purpose,shipments.shipment_number,shipments.status,to_char(shipments.order_date, 'DD/MM/YYYY') as order_date,shipments.order_time,
        shipments.shipment_id,shipments.cancel,shipments.sender_phone,shipments.shipment_type,shipments.num_of_returned,recipient_details.*,sender_details.*,users.subscription
        FROM shipments
        JOIN sender_details 
        ON shipments.sender_id=sender_details.sender_id
        JOIN recipient_details 
        ON shipments.recipient_id=recipient_details.recipient_id
        JOIN users
          ON shipments.sender_phone=users.phone
        WHERE shipments.sender_phone = $1 
         ORDER BY order_date DESC, order_time DESC
        ` ,
        values: [phone],
      }
      var shipments = await connection.query(query);
      return restructureRecipientObjects(shipments.rows);

    } catch (error) {
      console.error('Error executing a query:', error);
      return arr
    } finally {
      connection.release();
    }
}

async function getAllShipments() {
  var arr=[]
    try {
      try {
        /**
         * SELECT
            shipments.shipment_number,shipments.status,to_char(shipments.order_date, 'DD/MM/YYYY') as order_date,shipments.order_time,
                      shipments.shipment_id,shipments.sender_email,shipments.shipment_type,recipient_details.*,sender_details.* 
          FROM shipments
          LEFT JOIN recipient_details ON shipments.recipient_id = recipient_details.recipient_id
          LEFT JOIN sender_details ON shipments.sender_id = sender_details.sender_id
          ORDER BY order_date ASC
         */
          var connection=await getConnection()
          const query = {
            text: `        
             SELECT s.*, r.*, snd.*, u.subscription
                FROM shipments s
                LEFT JOIN sender_details snd ON s.sender_id = snd.sender_id
                LEFT JOIN recipient_details r ON s.recipient_id = r.recipient_id
                LEFT JOIN users u ON s.sender_phone = u.phone
                ORDER BY s.order_date DESC, s.order_time DESC;
  
            `,
            values: [],
          }
        var shipments = await connection.query(query);
      } catch (error) {
        console.error('Error executing a query:', error);
        return arr;
      } finally {
        connection.release();
      }
      return restructureRecipientObjects(shipments.rows);
      
    } catch (error) {
      console.log(error);
      return arr;
    }
  }

  function restructureRecipientObjects(arr) {
    return arr.map(item => {
      const recipientObj = {};
      const newObj = {};
  
      for (const key in item) {
        if (key === "order_date") {
          newObj.order_date = new Date(new Date(item.order_date).setDate(new Date(item.order_date).getDate() + 1))
          .toISOString()
          .split('T')[0];
        
        } else if (key.startsWith("recipient_")) {
          recipientObj[key.replace("recipient_", "")] = item[key];
        } else {
          newObj[key] = item[key];
        }
      }
  
      newObj.recipient = recipientObj;
      console.log(newObj.order_date)
      return newObj;
    });
  }
  

  async function getShipmentsToCancel() {
    var arr=[]
      try {
          var connection=await getConnection()
          const query = {
          text:`select shipments.shipment_purpose,shipments.shipment_number,shipments.status,to_char(shipments.order_date, 'DD/MM/YYYY') as order_date,shipments.order_time,
          shipments.shipment_id,shipments.cancel,shipments.sender_phone,shipments.shipment_type,shipments.num_of_returned,recipient_details.*,sender_details.*,users.subscription
          FROM shipments
          JOIN sender_details 
          ON shipments.sender_id=sender_details.sender_id
          JOIN recipient_details 
          ON shipments.recipient_id=recipient_details.recipient_id
          JOIN users
            ON shipments.sender_phone=users.phone
          WHERE shipments.cancel=true 
           ORDER BY order_date DESC, order_time DESC
          ` ,
          values: [],
        }
        var shipments = await connection.query(query);
        return restructureRecipientObjects(shipments.rows);
  
      } catch (error) {
        console.error('Error executing a query:', error);
        return arr
      } finally {
        connection.release();
      }
  }
  
module.exports = {getShipmentsByPhone,getAllShipments,getShipmentsToCancel};
