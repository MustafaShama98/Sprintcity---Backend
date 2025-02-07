var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.get("/all",Auth, async (req, res) => {
   var result;
   if(req.user.role==="admin"){
        result=await req.service.getAllAccounting();
        res.status(result.status).send(result)
    }else{
        res.status(400).send('לא אדמין')

    }
});
router.get("/three",Auth, async (req, res) => {
    var result;
    if(req.user.role==="admin"){
         result=await req.service.getAccountingLastThreeMonthe();
         res.status(result.status).send(result)
     }else{
         res.status(400).send('לא אדמין')
 
     }
 });
 router.get("/year",Auth, async (req, res) => {
    var result;
    if(req.user.role==="admin"){
         result=await req.service.getAccountingLastYear();
         res.status(result.status).send(result)
     }else{
         res.status(400).send('לא אדמין')
     }
 });
 router.get("/foruser/three/:email",Auth, async (req, res) => {
    var result;
         result=await req.service.getAccountingLastThreeMontheByEmail(req.params.email);
         res.status(result.status).send(result)
    
 });
 
 router.get("/foruser/year/:email",Auth, async (req, res) => {
    var result;
         result=await req.service.getAccountingLastYearByEmail(req.params.email);
         res.status(result.status).send(result)
    
 });
 router.get("/foruser/all/:email",Auth, async (req, res) => {
    var result;
         result=await req.service.getAllAccountingByEmail(req.params.email);
         res.status(result.status).send(result)
    
 });
module.exports = router;
