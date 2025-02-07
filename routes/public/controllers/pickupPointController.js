var express = require("express");
var router = express.Router();

router.get("/cityname/:city", async (req, res) => {
    console.log("iam here "+ req.params.city);
    const result=await req.service.getPickUpPointsBySettlementName(req.params.city);
    console.log(result);
    res.send(result)    
});

router.get("/citycode/:citycode", async (req, res) => {
    const result=await req.service.getPickUpPointsBySettlementCode(req.params.citycode);
    res.send(result)
});


module.exports = router;
