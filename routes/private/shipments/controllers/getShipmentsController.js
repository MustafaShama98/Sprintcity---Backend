var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.get("/",Auth, async (req, res) => {
   var result;
   if(req.user.role==="admin"){
        result=await req.service.getAllShipments();
        res.status(200).send(result)
    }else{
        res.status(400).send()
    }
});
router.get("/byphone/:phone",Auth, async (req, res) => {
        const result=await req.service.getShipmentsByPhone(req.params.phone);
        res.send(result)
   
});
router.get("/cancel",Auth, async (req, res) => {
    var result;
    if(req.user.role==="admin"){
         result=await req.service.getShipmentsToCancel();
         res.status(200).send(result)
     }
     else{
        res.status(400).send()
    }

});
module.exports = router;
