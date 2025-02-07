var express = require("express");
var router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body);
  const result = await req.service.contactUsService(req.body);
    res.status(result.status).send(result);
});



module.exports = router;
