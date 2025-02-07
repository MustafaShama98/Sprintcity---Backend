var express = require("express");
var router = express.Router();

router.post("/", async (req, res) => {
  console.log("here");
  console.log(req.body);
  const result = await req.service.login(req);
  console.log(result);
    res.status(result.status).send(result);
});

router.post("/verifyOTP", async (req, res) => {
  const result = await req.service.verifyOTPforEmail(req.body.email,req.body.otp);
    res.status(result.status).json(result);
});

router.post("/resendOTP", async (req, res) => {
  const result = await req.service.resendOTP(req.body.email);
  res.status(result.status).json(result);
});


module.exports = router;
