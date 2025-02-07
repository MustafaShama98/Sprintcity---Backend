var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.post("/",Auth, async (req, res) => {
    console.log(req.body.shipment_number,req.body.shipment_id);
    if(req.user.role==="admin"){
        const result=await req.service.updateShipmentNumber(req.body.shipment_number,req.body.shipment_id);
        console.log(result);

        res.status(result.status).send(result)
    }
    else{
        res.status(403).send("אירעה שגיאה")
    }
});

router.post("/cancel",Auth, async (req, res) => {    
        const result=await req.service.cancel_shipment(req.body.shipment_id);
        console.log(result);
        res.status(result.status).send(result)

});

router.post("/update",Auth, async (req, res) => {   
    console.log('body',req.body);
    const result=await req.service.deleteOrderProcess(req.body.shipment_id,req.body.status);
    console.log(result);
    res.sendStatus(result.status)

});



module.exports = router;
