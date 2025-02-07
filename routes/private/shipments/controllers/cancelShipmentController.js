var express = require("express");
var router = express.Router();
///const { Auth } = require("../../middlewares/Auth");

router.post("/", async (req, res) => {
    const result=await req.service.cancelShipmentByNumber(req.body.shipment_number);
    res.send(result)
});



module.exports = router;
