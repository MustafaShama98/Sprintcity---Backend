var express = require("express");
var router = express.Router();

router.get("/sendOTP/:email", async (req, res) => {
  console.log("test");
  console.log(req.params);

  const result = await req.service.sendOTP(req.params.email);
  res.status(result.status).send(result)
});
router.post("/reset", async (req, res) => {
  console.log(req.body);
    const result = await req.service.resetPassword(req.body.email,req.body.newPassword);
    res.status(result.status).send(result)
  });
  router.post("/ver", async (req, res) => {
    const result = await req.service.verifyOTPforPassword(req.body.email,req.body.otp);
    res.status(result.status).send(result)
  });

module.exports = router;
