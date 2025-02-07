var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.post("/",Auth, async (req, res) => {
    console.log(req.body);
    const result=await req.service.getShipmentLabel(req.body.shipment_number);
    if(result==='error'){
        console.log('err');
        res.send(' אירעה שגיאה ')        
    }else{
        console.log('qweqweqe');

        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="label.pdf"'); 
            result.data.pipe(res); 
            
        } catch (error) {
            res.send(' אירעה שגיאה ')        
        }
    }
});



module.exports = router;
