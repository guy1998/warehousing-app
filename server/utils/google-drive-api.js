const fs = require("fs");
const { google } = require("googleapis");
const { v4: uuidv4 } = require('uuid')

const auth = new google.auth.GoogleAuth({
  keyFile: "",
  scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({ version: "v3", auth });

async function uploadFile(uploadedFile) {
  const tempName = uuidv4();
  fs.writeFileSync("./utils/" + tempName, uploadedFile.buffer);
  const readableStream = fs.createReadStream("./utils/" + tempName);
  setTimeout(()=>{
    fs.unlinkSync("./utils/" + tempName);
  }, 5000);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: uploadedFile.originalname, // Name of the file in Google Drive
        mimeType: uploadedFile.mimeType, // Mime type of the file
        parents: ['1ls--MRlNZz4zPJSQlhWcBSV4T9fjpl0d']
      },
      media: {
        mimeType: uploadedFile.mimeType,
        body: readableStream
      }
    });

    return {response: true, id: response.data.id}
  } catch (error) {
    console.error("Error uploading file:", error);
    return {response: false, id: 'undefined'}
  }

}

async function deleteFile(fileId){
  try {
    await drive.files.delete({
      fileId: fileId
    });
  
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

module.exports = {
  uploadFile: uploadFile,
  deleteFile: deleteFile
};