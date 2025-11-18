import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Lê automaticamente CLOUDINARY_URL do .env
cloudinary.config(process.env.CLOUDINARY_URL);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'loja/itens_avulsos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export { cloudinary, storage };
