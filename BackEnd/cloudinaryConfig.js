require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config(process.env.CLOUDINARY_URL);cloudinary.config(process.env.CLOUDINARY_URL);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'loja', 
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
});

module.exports = {
  cloudinary,
  storage
};
