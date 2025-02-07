var express = require("express");
var router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body.data);
  const result = await req.service.signup(req);

  if (result.status==="failed") {
    res.send(400, result);
  } else {
    res.send(200, result);
  }
});

module.exports = router;
