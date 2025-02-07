
const {parentPort,workerData,getEnvironmentData}=require("node:worker_threads");
const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('../apikey.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
var arr=[]


authorize().then(async (auth)=>{
  var i=1;
  for(var file of workerData){
   await uploadFile(auth,file).then((file2)=>{
      var filePath = `${__dirname}/temp/${file2.file}`;
      arr.push({status:200,index:i,name:file2.file})
      i++;
       fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
      });
    }).catch((errfile)=>{
      var filePath = `${__dirname}/temp/${errfile.file}`;
      arr.push({status:400,index:i,name:errfile.file})
      i++;
       fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
      });
    })
  }
  console.log(arr);
  parentPort.postMessage(arr);
}).catch((error)=>{
 console.error(error);
 parentPort.postMessage(`There was an error when uploading file `);
}); 



  async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient,data){
  

    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 
        var fileMetaData = {
            name:`${data.email}_`,    
            parents:['1KuPL6tk6p_vn30djU-R2CRC1BSI1A8Wv'] // A folder ID to which file will get uploaded
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream(`${__dirname}/temp/${data.file}`), 
                mimeType:data.type
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(data)
            }
            resolve(data);
        })
    });
}
