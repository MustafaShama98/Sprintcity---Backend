var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");


router.post('/checkdash',Auth,async (req,res)=>{
        var check=await validateParams(req.body);
        console.log(check)
        if(check!== 'valid'){
            res.status(400).json({check})
      }else{
        res.status(200).json({status:'success'})
      }
})
router.post('/checkout',async (req,res)=>{
    console.log('body',req.body)
    const obj=refactorNamesOutSide(req.body)
    console.log( 'obj',obj)
    var check=await validateParams(obj);
    if(check!== 'valid'){
        res.status(400).json({check})
    }else{
        res.status(200).json({ status: 'success' });
    }
})

router.post("/", Auth,async (req, res) => {
    console.log(req.service);
    var totalCost = 0;
    var totalAmount = 0;
    var newCost=0;
    var arr=[]
    var result;
        for(const order of req.body){
            order.shipment_type=order.shipment_details.value;
            order.sende_email=req.user.email;
            order.packages_number=order.shipment_quantity;
            order.cargo_type=order.shipment_details.cargo_type;
            order.shipment_cargo=order.shipment_details.shipment_cargo;
            if(order.shipment_details.assign_pickup_point){
                 order.assign_pickup_point=order.shipment_details.assign_pickup_point;
            }//
            if(order.payment_type==='מזומן'){
                 order.payment_code=1;
            }
            if(order.payment_type===`צ'ק`){
                order.payment_code=2;
           }
           console.log(order);

            if(order.destination_pickup_point){
                const code=await req.service.getPickUpPointCode(order.recipient_city,order.destination_pickup_point)
                order.destination_pickup_point=code;
            }
            console.log(order.destination_pickup_point);
         if(req.user.customer_number==0){
             arr.push(await req.service.shipmentSaveNotPremium(order));
             if(arr[arr.length-1].status===200){
                 totalCost = parseInt(order.shipment_details.sum, 10);
                 totalAmount +=1;
                 newCost+=totalCost;
                 totalCost=0;
             }
        }else{
            order.customer_number=req.user.customer_number;
            arr.push(await req.service.shipmentCreateAndSave(order));
            if(arr[arr.length-1].status===200){
                totalCost = parseInt(order.shipment_details.sum, 10);
                totalAmount +=1;
                newCost+=totalCost;
                totalCost=0;
            }
         }
        }
        if(req.user.subscription==='premium'){
            await req.service.updateCost(req.user.email,newCost,totalAmount);
        }
        res.send(arr)

});


router.post("/outside",async (req, res) => {
    const obj=refactorNamesOutSide(req.body)
     result=await req.service.shipmentSaveNotPremium(obj);
     console.log(result);
 
     res.status(result.status).send(result)
});
module.exports = router;

function validateParams(params) {
    const isPhoneNumber = (number) => /^\d+$/.test(number) && number.length === 10;
  
    const {
      sender_phone,
      sender_building,
      sender_entrance,
      sender_floor,
      recipient_phone,
      recipient_building,
      recipient_entrance,
      recipient_floor,
    } = params;
  
    if (!isPhoneNumber(sender_phone)) {
      return 'sender_phone';
    }
    if (!isPhoneNumber(recipient_phone)) {
      return 'recipient_phone';
    }
  
    const senderParams = [sender_building, sender_entrance, sender_floor];
    const recipientParams = [
      recipient_building,
      recipient_entrance,
      recipient_floor,
    ];
 
    for (let i = 0; i < senderParams.length; i++) {
        //console.log("senderParams ",senderParams[i])
      if (senderParams[i] !== null && senderParams[i] !== undefined && isNaN(Number(senderParams[i]))) {
        return `sender_${['building', 'entrance', 'floor'][i]}`;
      }
    }
  
    for (let i = 0; i < recipientParams.length; i++) {
       // console.log("recipientParams ",recipientParams[i])
      if (
        recipientParams[i] !== null &&recipientParams[i] !== undefined &&
        isNaN(Number(recipientParams[i]))
      ) {
        return `recipient_${['building', 'entrance', 'floor'][i]}`;
      }
    }
    return 'valid';
  }
  
 function refactorNamesOutSide(body){
var obj={};
obj.sender_name=body.senderData.firstName
obj.sender_street=body.senderData.street
obj.sender_phone=body.senderData.phoneNumber
obj.sender_city=body.senderData.city
obj.sender_email=body.senderData.email
obj.sender_appartment=body.senderData.zip

if(body.senderData.deliveryType==2){
    obj.shipment_type=240;
}else{
    obj.shipment_type=140;
}
if(body.senderData.deliveryType==4){
    obj.num_of_returned=body.senderData.num_of_returned;
}

if(body.senderData.deliveryType==1){
    obj.shipment_cargo='חבילה רגילה';
}
if(body.senderData.deliveryType==2){
    obj.shipment_cargo='חבילה עד נקודת שירות';
}
if(body.senderData.deliveryType==3){
    obj.shipment_cargo='משטח עד מידות 80*120';
}
if(body.senderData.deliveryType==4){
    obj.shipment_cargo='מסירה חבילה ו החזרת חבילה ';
}
if(body.senderData.deliveryType==5){
    obj.shipment_cargo='מסירה חבילה ו החזרת תעודה חתומה ';
}
if(body.senderData.deliveryType==6){
    obj.shipment_cargo='חבילה עד 40 ק"ג';
}
obj.packages_number=body.senderData.quantity
obj.recipient_name=body.recieverData.firstName
obj.recipient_street=body.recieverData.street
obj.recipient_phone=body.recieverData.phoneNumber
obj.recipient_city=body.recieverData.city
obj.recipient_appartment=body.recieverData.zip
obj.shipment_purpose='מסירה'
if(body.recieverData.houseRow){
    obj.recipient_floor=body.recieverData.houseRow
}if(body.recieverData.houseEntry){
    obj.recipient_enterance=body.recieverData.houseEntry
}if(body.recieverData.houseNumber){
    obj.recipient_building=body.recieverData.houseNumber
}if(body.senderData.houseRow){
    obj.sender_floor=body.senderData.houseRow
}if(body.senderData.houseNumber){
    obj.sender_building=body.senderData.houseNumber
}if(body.senderData.houseEntry){
    obj.sender_enterance=body.senderData.houseEntry
}if(body.senderData.senderNote){
    obj.sender_address_notes=body.senderData.senderNote
}
return obj;

}