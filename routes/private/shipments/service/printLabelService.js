const {ship_print_ws}=require("../../../../helpers/run_ERP_API_urlgenerator")


const axios = require('axios');

async function getShipmentLabel(shipmentNumber){
    var url=ship_print_ws();
    url+=`-N${shipmentNumber}`
    try {
        const urlObject={
            method: 'GET',
            url:url,
            responseType: 'stream',
        }
        const pdfResponse = await axios(urlObject)
            return pdfResponse
          
    } catch (error) {
            return 'error'
    }
  }

  module.exports = getShipmentLabel;
