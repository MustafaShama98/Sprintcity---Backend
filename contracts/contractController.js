const express = require('express');
const multer = require('multer');
const router = express();
const { Auth } = require("../middleware/Auth");

const {
  addUploadedFile,
  getUploadedFiles,
  unlinkFiles,
}=require('./fileData')
const  {Worker,  workerData }  = require("node:worker_threads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/temp/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });
router.post('/aa',upload.array('file'),(req,res)=>{
  console.log(req.files);
})

router.post('/contract',Auth, upload.array('file'), (req, res) => {
  console.log(req.files);
  for(var file of req.files){
    var type=getFileType(file.filename)
    if(type!=='unknown'){
      addUploadedFile(file.filename,req.user.email,type)
    }else if(type==='unknown'){
      var filePath = `${__dirname}/temp/${file.filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
      });
    }

    
  }
  var data=getUploadedFiles()
  let worker = new Worker(`${__dirname}/worker.js`, { workerData: data});
  var arr=[];

  worker.on('message', (message) => {
    arr=message;
    console.log('these files where uploaded successfully', message);
    for(var i=0;i<message.length;i++){
      unlinkFiles(message[i].name)
    }
    sendResponse(res, message);

  });
});

function sendResponse(res, arr) {
  res.send(arr);
}
function getFileType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'txt':
      return 'text/plain';
    default:
      return 'unknown'; 
  }
}

module.exports = router;
