const multer = require('multer');
const aws = require('aws-sdk');
const s3bucket = new aws.S3()

const S3_BUCKET_NAME  = process.env.S3_BUCKET_NAME;


const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
      callback(null, '')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.fieldname)
    }
})
  
const singleFileUploadMiddleware = multer({
    storage: storage,
    limits: { fieldSize: 100 * 1024 * 1024 }
  }).single('file');


function uploadFileTos3 (file, path){
    return new Promise((resolve, reject) => {
        s3bucket.createBucket(function() {
            const timeStamp = Date.now();
            const randomBit = `${timeStamp}${Math.floor((Math.random() * 900) + 100)}`;
            const filePath = `${path}/${file.fieldname}_${randomBit}`;
            const fileExt = '.' + file.mimetype.split('/')[1];
            const fileName = filePath + fileExt;
            const params = {
                Bucket: S3_BUCKET_NAME,
                ContentType: file.mimetype,
                Key: fileName,
                Body: file.buffer,
                ACL: 'public-read'
            }
            s3bucket.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    })
}






  module.exports = {
    singleFileUploadMiddleware,
    uploadFileTos3
  }