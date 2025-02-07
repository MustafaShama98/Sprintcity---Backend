var express = require("express");
var router = express.Router();

router.get("/shipmentNumber/:shipmentNumber", async (req, res) => {
   
    const result=await req.service.trackShipmentByNumber(req.params.shipmentNumber);

    if(result==="מספר משלוח לא תקין"){
        res.status(400).send(result)
    }else{

        res.send(result)    

    }
});

router.get("/identificationletters/:identificationletters", async (req, res) => {
    const result=await req.service.trackShipmentByIdentificationLetters(req.params.identificationletters);
    res.send(result)
});


module.exports = router;
