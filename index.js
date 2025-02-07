
var express = require("express");
var app = express();
var cors = require('cors')

var bodyParser = require("body-parser");
require("dotenv").config();


const {login,verifyOTPforEmail,resendOTP} = require("./routes/public/service/loginService.js");
const signup = require("./routes/public/service/singUpService");
const {shipmentCreateAndSave,shipmentSaveNotPremium,updateCost} = require("./routes/private/shipments/service/createShipmentService.js");
const cancelShipmentByNumber = require("./routes/private/shipments/service/cancelShipmentService.js");
const {updateShipmentNumber,cancel_shipment,deleteOrderProcess} = require("./routes/private/shipments/service/updateShipmentNumberService.js");
const {getShipmentsByPhone,getAllShipments,getShipmentsToCancel} = require("./routes/private/shipments/service/getShipmentsService.js");
const {updateUserCustomerNumber,verifyUserPremium} = require("./routes/private/user/service/updateUserService.js");
const {getUserAddress,getUserInfo} = require("./routes/private/user/service/userInfoService.js");
const {resetPassword,sendOTP,verifyOTPforPassword}=require('./routes/public/service/resetPasswordService.js')
const getShipmentLabel = require("./routes/private/shipments/service/printLabelService.js");
const {getAllAccountingByEmail,getAccountingLastYearByEmail,getAccountingLastYear,getAllAccounting,getAccountingLastThreeMonthe,getAccountingLastThreeMontheByEmail,getAccountingSpecificDateByEmail,getAccountingSpecificDate}=require('./routes/private/user/service/getAccountingService.js')
const contactUsService=require('./routes/public/service/contactUsService.js')

const {trackShipmentByNumber,trackShipmentByIdentificationLetters}=require('./routes/public/service/shipmentTrackingService.js')
const {getPickUpPointsBySettlementName,getPickUpPointsBySettlementCode,getPickUpPointCode}=require('./routes/public/service/pickupPointService.js')

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors())

const getParameters=require("./helpers/shipmentParamsGenerator.js")
app.get('/h',async(req,res)=>{
  const url=getParameters(req.body)
  res.send(url)
})
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS,PUT"
  );
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);

  next();
});


const exposeLogInService = async (req, res, next) => {
  req.service = LogInService();
  next();
};
const LogInService = () => {
  return Object.freeze({
    login,verifyOTPforEmail,resendOTP,
  });
};

const exposeSingUpService = async (req, res, next) => {
  req.service = SingUpService();
  next();
};
const SingUpService = () => {
  return Object.freeze({
    signup,
  });
};

const exposeTrackingShipment = async (req, res, next) => {
  req.service = tracking();
  next();
};
const tracking = () => {
  return Object.freeze({
    trackShipmentByNumber,trackShipmentByIdentificationLetters,
  });
};


const exposePickUpPoints = async (req, res, next) => {
  req.service = pickUp();
  next();
};
const pickUp = () => {
  return Object.freeze({
    getPickUpPointsBySettlementName,
    getPickUpPointsBySettlementCode,getPickUpPointCode,
  });
};


const exposeCreateShipment = async (req, res, next) => {
  req.service = createShipment();
  next();
};
const createShipment = () => {
  return Object.freeze({
    shipmentCreateAndSave,shipmentSaveNotPremium,updateCost,getPickUpPointCode,
  });
};

const exposeCancelShipment = async (req, res, next) => {
  req.service = cancelShipment();
  next();
};
const cancelShipment = () => {
  return Object.freeze({
    cancelShipmentByNumber,
  });
};
const exposeUpdateShipmentNum = async (req, res, next) => {
  req.service = updateShipmentNum();
  next();
};
const updateShipmentNum = () => {
  return Object.freeze({
    updateShipmentNumber,cancel_shipment,deleteOrderProcess,
  });
};

const exposeGetShipments = async (req, res, next) => {
  req.service = getShipmentsForUser();
  next();
};
const getShipmentsForUser = () => {
  return Object.freeze({
    getShipmentsByPhone,getAllShipments,getShipmentsToCancel
  });
};

const exposeUpdateUser = async (req, res, next) => {
  req.service = updateUser();
  next();
};
const updateUser = () => {
  return Object.freeze({
    updateUserCustomerNumber,verifyUserPremium,
  });
};
const exposeUserInfo = async (req, res, next) => {
  req.service = UserInfo();
  next();
};
const UserInfo = () => {
  return Object.freeze({
    getUserAddress,getUserInfo,
  });
};


const exposePrintLabel = async (req, res, next) => {
  req.service = printLabel();
  next();
};
const printLabel = () => {
  return Object.freeze({
    getShipmentLabel,
  });
};

const exposeResetPassword = async (req, res, next) => {
  req.service = resetPassword2();
  next();
};
const resetPassword2 = () => {
  return Object.freeze({
    resetPassword,sendOTP,verifyOTPforPassword,
  });
};
const exposeContactUs = async (req, res, next) => {
  req.service = ContactUs();
  next();
};
const ContactUs = () => {
  return Object.freeze({
    contactUsService,
  });
};
const exposeAccountingInfo = async (req, res, next) => {
  req.service = Accoutning();
  next();
};
const Accoutning = () => {
  return Object.freeze({
    getAccountingLastThreeMonthe,getAccountingLastThreeMontheByEmail,
    getAccountingSpecificDateByEmail,getAccountingSpecificDate,getAllAccounting,
    getAccountingLastYear,getAccountingLastYearByEmail,getAllAccountingByEmail,
  });
};

app.get("/test", async (req, res) => {


    res.send('uuhijij')


});
app.use(
  "/contactus",
  exposeContactUs,
  require("./routes/public/controllers/contactUsController.js")
);
app.use(
  "/accounting",
  exposeAccountingInfo,
  require("./routes/private/user/controllers/getAccountingController.js")
);



app.use(
  "/signup",
  exposeSingUpService,
  require("./routes/public/controllers/singUpController.js")
);

app.use(
  "/reset",
  exposeResetPassword,
  require("./routes/public/controllers/resetPasswordController.js")
);
app.use(
  "/login",
  exposeLogInService,
  require("./routes/public/controllers/loginController.js")
);
app.use(
  "/ordershipment",
  exposeCreateShipment,
  require("./routes/private/shipments/controllers/createShipmentController.js")
);
app.use(
  "/print",
  exposePrintLabel,
  require("./routes/private/shipments/controllers/printLabelController.js")
);
app.use(
  "/tracking",
  exposeTrackingShipment,
  require("./routes/public/controllers/shipmentTrackingController.js")
);
app.use(
  "/pickup",
  exposePickUpPoints,
  require("./routes/public/controllers/pickupPointController.js")
);
app.use(
  "/cancelshipment",
  exposeCancelShipment,
  require("./routes/private/shipments/controllers/cancelShipmentController.js")
);
app.use(
  "/updateshipmentnum",
  exposeUpdateShipmentNum,
  require("./routes/private/shipments/controllers/updateShipmentNumberController.js")
);

app.use(
  "/getshipments",
  exposeGetShipments,
  require("./routes/private/shipments/controllers/getShipmentsController.js")
);

app.use(
  "/updateuser",
  exposeUpdateUser,
  require("./routes/private/user/controllers/updateUserController.js")
);
app.use(
  "/getuser",
  exposeUserInfo,
  require("./routes/private/user/controllers/userInfoController.js")
);
app.use(
  "/upload",
  require("./contracts/contractController.js")
);


  app.listen(process.env.serverPORT,()=>{
    console.log(`server listening on port ${process.env.serverPORT}`)
  });
  