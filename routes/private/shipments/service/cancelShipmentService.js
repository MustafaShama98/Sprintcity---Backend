const xml2js = require('xml2js');
const {bitul_mishloah}=require("../../../../helpers/run_ERP_API_urlgenerator")
const {makeAPICallrunERP}=require('../../../../helpers/apiCalls')
const getConnection = require('../../../../DataBase/getDataBaseConnection');

async function cancelShipmentByNumber(shipmentNumber){
    try {
        var connection=await getConnection()
        const query1  = {
            text: `SELECT shipment_rand_number FROM shipments WHERE shipment_number=$1`,
            values: [shipmentNumber],
          }
          var temp = await connection.query(query1);
          if(temp.rows.length===1){
              var shipment_rand_number=temp.rows[0].shipment_rand_number;
              var url=bitul_mishloah();
              url+=`-A${shipment_rand_number},-A,-A,-A,-N`
                return `המשלוח בוטל בהצלחה`
          //     const xmlResponse=await makeAPICallrunERP(url);
          //     const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
          //      console.log(jsonObject.root);
          //     if(jsonObject.root.Status[0]==="OK"){
          //       return `המשלוח בוטל בהצלחה`
          //     }
          //     const status=jsonObject.root.Status_desc[0];
          //     return status;
           }
          
          return `somthing went wrong please try again`
        } catch (error) {
         console.log(error);
        return `somthing went wrong please try again`
    }finally{
        connection.release();
    }
  }
  module.exports = cancelShipmentByNumber;
