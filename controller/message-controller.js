const express = require('express');
const PostMsg = require('../model/messageSchema');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dvftjzzye',
    api_key: '589481272175751',
    api_secret: 'WHcz2Mu_GJ13-yaNFZ0cP52W188'
});

const message = async (req, res) => {
    try {
        const { Username, Message } = req.body;

        if (!Username || !Message) {
            return res.status(400).json({ message: "Please fill provided fields" });
        }

        let imageArray = [];
        
        // Only process images if files were uploaded
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: 'images',
                    resource_type: 'auto'
                })
            );

            const results = await Promise.all(uploadPromises);

            imageArray = results.map(result => ({
                url: result.secure_url,
                publicId: result.public_id
            }));

            // Clean up uploaded files
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }

        const postData = await PostMsg.create({ 
            username: Username, 
            message: Message, 
            images: imageArray 
        });

        res.status(200).json({ 
            success: true, 
            message: "Successfully Post", 
            data: postData 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getMessage = async (req, res) => {
    try {
        // Get page and limit from query parameters, set defaults if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of messages
        const totalMessages = await PostMsg.countDocuments();
        
        // Get paginated messages
        const messages = await PostMsg.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ 
            success: true, 
            data: messages,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages: totalMessages,
                messagesPerPage: limit
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { message, getMessage };