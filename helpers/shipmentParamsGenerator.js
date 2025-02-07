require("dotenv").config({path:'../.env'});
const {ship_create_anonymous}=require("./run_ERP_API_urlgenerator")

function generateShipmentURL (parameters){
  const obj = Object.assign({}, parameters);
 

  if(obj.shipment_purpose==='איסוף'){
      obj.recipient_name=parameters.sender_name;
      obj.recipient_city=parameters.sender_city;
      obj.recipient_street=parameters.sender_street;
      obj.recipient_building=parameters.sender_building;
      obj.recipient_entrance=parameters.sender_entrance;
      obj.recipient_floor=parameters.sender_floor;
      obj.recipient_apartment=parameters.sender_apartment;
      obj.recipient_phone=parameters.sender_phone;
      obj.recipient_email=parameters.sender_email;
      obj.recipient_address_notes=parameters.sender_address_notes;
  }

    var count=0;
    console.log(parameters);
    const dictionary = new Map();
    dictionary.set("customer_number", ["N",parameters.customer_number]);//*!1
    dictionary.set("shipment_purpose", ["A",""]);//*!  2    ;בחירה האם מסירה / איסוף / חופשי
    dictionary.set("shipment_type", ["N",""]);////*!   3  קוד סוג משלוח - 140 בתים פרטיים/ 240 מרכזי שירות 
    dictionary.set("shipment_stage", ["N",process.env.shipmentStage]);////*!  4
    dictionary.set("company_name", ["A",process.env.companyName]);//*!   5
    dictionary.set("blank1", ["A",""]);//*6
    dictionary.set("cargo_type", ["N",""]);////*!7 וג מטען הלוך - 199 בתים פרטיים 198 מרכזי שירות 
    dictionary.set("returned_cargo_type", ["N",""]);//**  8 
    dictionary.set("num_of_returned", ["N",""]); //**     9  מספר האריזות הנדרשות להחזיר ללקוח
    dictionary.set("blank2", ["N",""]);//*10
    dictionary.set("recipient_name", ["A",""]);//*! 11 שם נמען 
    dictionary.set("recipient_city_code", ["A",""]);//**  12  קוד ישוב-אופציונל
    dictionary.set("recipient_city", ["A",""]);//*! 13    
    dictionary.set("recipient_street_code", ["A",""]);//* 14  קוד רחוב-אופציונלי
    dictionary.set("recipient_street", ["A",""]);//*! 15    
    dictionary.set("recipient_building", ["A",""]);//*! 16    
    dictionary.set("recipient_entrance", ["A",""]);//* 17
    dictionary.set("recipient_floor", ["A",""]);//*18
    dictionary.set("recipient_apartment", ["A",""]);//*! 19     דירה (במידה ולא ידוע יש לציין 0)
    dictionary.set("recipient_phone", ["A",""]);//*! 20
    dictionary.set("additional_phone", ["A",""]);//*21
    dictionary.set("reference_shipment_number", ["A",""]);//*22
    dictionary.set("packages_number", ["N",""]);//*23
    dictionary.set("recipient_address_notes", ["A",""]);//*24
    dictionary.set("additional_shipment_notes", ["A",""]);//*25
    dictionary.set("seconde_reference_shipment_number", ["A",""]);//*26
    dictionary.set("pickup_date", ["A",""]);//*27
    dictionary.set("pickup_time", ["A",""]);//*28
    dictionary.set("blank3", ["N",""]);//*29
    dictionary.set("payment_code", ["N",""]);//*30
    dictionary.set("payment_sum", ["N",""]);//*31
    dictionary.set("payment_date", ["A",""]);//*32
    dictionary.set("payment_collection_notes", ["A",""]);//*33
    dictionary.set("source_pickup_point", ["N",""]);//*34
    dictionary.set("destination_pickup_point", ["N",""]);//*35
    dictionary.set("response_type", ["A","xml"]);//*!36 סוג תשובה TXT או XML
    dictionary.set("assign_pickup_point", ["A",""]);//*37
    dictionary.set("blank4", ["A",""]);//*38
    dictionary.set("blank5", ["N",""]);//*39
    dictionary.set("recipient_email", ["A",""]);//*!40
    dictionary.set("collection_date", ["A",""]);//*41
    dictionary.set("collection_time", ["A",""]);//*42 




    
   for (const param in obj){
     if(dictionary.has(param)){    
          if(obj[param]){
            dictionary.set(param, [dictionary.get(param)[0],obj[param]]);

          }
    }
   
    }
 /** if(dictionary.get("shipment_type")[1]===240){
    dictionary.set("cargo_type", [dictionary.get("cargo_type")[0],198]);
  }else{
    dictionary.set("cargo_type", [dictionary.get("cargo_type")[0],199]);
  } */
  if(dictionary.get("recipient_apartment")[1]===""){
    dictionary.set("recipient_apartment", [dictionary.get("recipient_apartment")[0],0]);
  }
  if(dictionary.get("recipient_building")[1]===""){
    dictionary.set("recipient_building", [dictionary.get("recipient_building")[0],0]);
  }
  if(dictionary.get("shipment_purpose")[1]=='איסוף'||dictionary.get("cargo_type")[1]==190||dictionary.get("cargo_type")[1]==100){
    dictionary.set("returned_cargo_type", [dictionary.get("returned_cargo_type")[0],dictionary.get("cargo_type")[1]]);
  }
    let str=ship_create_anonymous();
    for (const [key, value] of dictionary) {
        str+=`-${value[0]}${value[1]}`
        count++;
        if(count<dictionary.size) str+=`,`
      }

      console.log(str);
    return str;
}

function errorTable(errorNum){
  const errorDictionary = new Map();
  errorDictionary.set("0","חלה שגיאה בטיפול בבקשתך, אנא נסה שניית מאוחר יותר");
  errorDictionary.set("100",`שם ישוב שגוי, אנא הקפיד להכניס שם ישוב ע"פ משרד הפנים`);
  errorDictionary.set("200",`שם רחוב שגוי, אנא הקפיד להכניס שם ישוב ע"פ משרד הפנים`);
  errorDictionary.set("300","נקודת חלוקה יעד אינה תקינה");
  errorDictionary.set("400","נקודת חלוקה מקור אינה תקינה");
  errorDictionary.set("500","אסמכתא: כבר נקלטה במשלוח");
  errorDictionary.set("600","אסמכתא 2: כבר נקלטה במשלוח");
  errorDictionary.set("700","שדה איסוף/ מסירה שגוי ");
  errorDictionary.set("800","חסר שם נמען ");
  errorDictionary.set("900","לא נמצאה  נקודת חלוקה יעד");
  errorDictionary.set("1000","לא נמצאה נקודת חלוקה-טעות בישוב חוזר מגוגל");
  errorDictionary.set("1200","כמות אריזות הלוך גדולה מהמותר");
  errorDictionary.set("1300","כמות אריזות חזור גדולה מהמותר");
  errorDictionary.set("1500","לקוח לא רשאי להזמין");
  errorDictionary.set("1600","אין מחיר עבור כתובת למשלוח שצוינה במערכת חברת השילוח");
  errorDictionary.set("1700","אין מחיר עבור סוג משלוח/מטען מוגדר במערכת חברת השילוח");
  errorDictionary.set("1800","כתובת שגויה");
  if(errorDictionary.has(errorNum))
  {
    return errorDictionary.get(errorNum)
  }
  return errorDictionary.get("0")
}
module.exports = {generateShipmentURL,errorTable};
