var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.post("/customernumber",Auth, async (req, res) => {
    if(req.user.role==='admin'){
        const result=await req.service.updateUserCustomerNumber(req.body.customer_number,req.body.email);
        res.send(result)
    }else{
        res.send('error')
    }
});
router.post("/verifyprem/:email",Auth, async (req, res) => {
    if(req.user.role==='admin'){
        const result=await req.service.verifyUserPremium(req.params.email);
        res.send(result)
    }else{
        res.send('error')
    }
});





module.exports = router;
