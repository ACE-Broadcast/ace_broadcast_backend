const cloudinary = require('cloudinary').v2;
const ImageModel = require('../model/imageSchema');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dvftjzzye',
    api_key: '589481272175751',
    api_secret: 'WHcz2Mu_GJ13-yaNFZ0cP52W188'
});

const uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const uploadPromises = req.files.map(file => 
            cloudinary.uploader.upload(file.path, {
                folder: 'images',
                resource_type: 'auto'
            })
        );

        const results = await Promise.all(uploadPromises);

        const imageArray = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }));

        const newImage = new ImageModel({
            images: imageArray
        });
        await newImage.save();

        // Clean up uploaded files
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        res.status(201).json({
            success: true,
            images: imageArray,
            message: 'Images uploaded successfully'
        });

    } catch (error) {
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await ImageModel.find();
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching images',
            error: error.message
        });
    }
};

module.exports = {
    uploadImage,
    getImages
};