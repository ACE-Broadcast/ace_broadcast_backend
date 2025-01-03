const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, getImages } = require('../controller/image-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('images', 5), uploadImage); // Allow up to 5 images
router.get('/images', getImages);

module.exports = router;