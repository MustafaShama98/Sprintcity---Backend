const {makeAPICallrunERP}=require('../../../helpers/apiCalls')
const xml2js = require('xml2js');
const {ws_spotslist}=require("../../../helpers/run_ERP_API_urlgenerator")



async function getPickUpPointsBySettlementName(cityName){
  var url=ws_spotslist();
    url+=`-A${cityName}`
    const xmlResponse=await makeAPICallrunERP(url)
    if(xmlResponse==='string'){
      console.log(xmlResponse);
      return "somthing went wrong, please try again later"   
     }
    
    const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
    var arr=[]
    var city;
    for(var i=0;i<jsonObject.root.spots[0].spot_detail.length;i++){
      city=jsonObject.root.spots[0].spot_detail[i].name[0]
      arr.push(city)
    }
    return arr
  }

  async function getPickUpPointCode(cityName,pickup){
    var url=ws_spotslist();
      url+=`-A${cityName}`
      const xmlResponse=await makeAPICallrunERP(url)
      if(xmlResponse==='string'){
        console.log(xmlResponse);
        return "somthing went wrong, please try again later"   
       }
      const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
      var code;
      for(var i=0;i<jsonObject.root.spots[0].spot_detail.length;i++){
        if(jsonObject.root.spots[0].spot_detail[i].name[0]===pickup){
            code=jsonObject.root.spots[0].spot_detail[i].n_code[0]
        }
      }
      return code
    }
  async function getPickUpPointsBySettlementCode(cityCode){
    var url=ws_spotslist();
      url+=`-A,-A,-N${cityCode}`
      const xmlResponse=await makeAPICallrunERP(url)
      if(xmlResponse==='string'){
        console.log(xmlResponse);
        return "somthing went wrong, please try again later"   
       }
      
      const jsonObject = await xml2js.parseStringPromise(xmlResponse.data);
      var arr=[]
      for(var i=0;i<jsonObject.root.spots[0].spot_detail.length;i++){
        arr.push(jsonObject.root.spots[0].spot_detail[i].name)
      }
      return arr
    }
  module.exports = {getPickUpPointsBySettlementName,getPickUpPointsBySettlementCode,getPickUpPointCode};

