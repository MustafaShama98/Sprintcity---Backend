var express = require("express");
var router = express.Router();
const { Auth } = require("../../../../middleware/Auth");

router.get("/",Auth, async (req, res) => {
    console.log('hey');
    const result=await req.service.getUserAddress(req.user.email);
    console.log(result);
    res.send(result)
});

router.get("/users",Auth, async (req, res) => {
    if(req.user.role==='admin'){
        const result=await req.service.getUserInfo();
        res.send(result)
    }else{

        res.send("not admin")
    }
});



module.exports = router;
