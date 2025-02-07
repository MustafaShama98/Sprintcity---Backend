const xml2js = require('xml2js');
const {ship_status_xml}=require("../../../helpers/run_ERP_API_urlgenerator")
const {makeAPICallrunERP}=require('../../../helpers/apiCalls')
const getConnection=require("../../../DataBase/getDataBaseConnection")



// async function trackShipmentByNumber(shipmentNumber){//62290645
//     var url=ship_status_xml();
//     url+=`-N${shipmentNumber}`
//     const xmlResponse=await makeAPICallrunERP(url);
//     if(typeof xmlResponse==='string'){
//       return {status:"מספר משלוח לא תקין"}
//     }else{
//       const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
//       updateStatus(jsonObject.root.mydata[0].current_stage_desc[0],jsonObject.root.mydata[0].ship_no[0])
//       const status={
//       status:jsonObject.root.mydata[0].current_stage_desc[0],
//       order_date:jsonObject.root.mydata[0].status[0].status_date[0],
//       order_time:jsonObject.root.mydata[0].status[0].status_time[0],  
//       shipment_number:jsonObject.root.mydata[0].ship_no[0]
//     }
//       return status
//     }
//   }

  async function trackShipmentByNumber(shipmentNumber){//62290645
    const status = ["בתהליך ביצוע",  "התקבל","מבוטל"];
    return {
      shipmentNumber,
      shipment_number:Math.floor(Math.random() * 10 )
      + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: status[Math.floor(Math.random() *2)],
      order_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now, date only
      currentLocation: 'מחסן',
      history: [
        { location: 'מחסן', timestamp: new Date().toISOString() },
        { location: 'מרכז הפצה', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() } // 2 days ago
      ]
    };
  }

async function updateStatus(status,shipment_number){
  var connection = await getConnection();
  try {
    const query = {
      text:  ` UPDATE shipments
                SET status = $1
              WHERE status <> $1 AND shipment_number=$2` ,
      values: [status,shipment_number],
    }
    var update = await connection.query(query);
  } catch (error) {
    console.log(error);
  }
}

  async function trackShipmentByIdentificationLetters(identificationletters){
    var url=ship_status_xml();
    url+=`${identificationletters}`
    const xmlResponse=await makeAPICallrunERP(url);
    if(typeof xmlResponse==='string'){
      console.log(xmlResponse);
      return "somthing went wrong, please try again later"
    }
    else{            
      const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
      const status=jsonObject.root.mydata[0].current_stage_desc;
    } 
  }
  
module.exports = { trackShipmentByNumber, trackShipmentByIdentificationLetters,};


