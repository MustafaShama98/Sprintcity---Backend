// fileData.js

let uploadedFiles = [];

function addUploadedFile(filename,email,type) {
    var obj={
        file:filename,
        email:email,
        type:type
    }
  uploadedFiles.push(obj);
}

function getUploadedFiles() {
  return uploadedFiles;
}

function unlinkFiles(fileName) {
  let index = uploadedFiles.findIndex(obj => obj.file === fileName);
if (index !== -1) {
  uploadedFiles.splice(index, 1); // Remove 1 element starting from the found index
}
}
module.exports = {
  addUploadedFile,
  getUploadedFiles,
  unlinkFiles,
};
