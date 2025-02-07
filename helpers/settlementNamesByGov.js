const axios = require('axios');
const {makeAPICallGOV}=require('./apiCalls')
/**worker that proceed this code once a week, if an error happens then stay on the old list */

async function getSettlementNames(){
    var count=0
    var total;
    var arr=[]
    try {
        var xmlResponse = await makeAPICallGOV(count);
        console.log(xmlResponse);
        total=xmlResponse.data.result.total;
        for(count=0;count<total;count+=100){
             xmlResponse = await makeAPICallGOV(count);
            for(i=0;i<xmlResponse.data.result.records.length;i++){
                arr.push(xmlResponse.data.result.records[i].שם_ישוב)
            }        
        }
    } catch (error) {
        console.log(error);
    }
    return arr;
  }
  
  getSettlementNames()