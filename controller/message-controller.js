const express = require('express');
const PostMsg = require('../model/messageSchema');

const message = async (req, res) => {
    try {
        const { Username, Message } = req.body;

        if (!Username || !Message) {
            res.status(400).json({ message: "Please fill provided fields" });
        }

        const postData = await PostMsg.create({ username: Username, message: Message });

        res.status(200).json({ success: true, message: "Successfully Post", data: postData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getMessage = async (req, res) => {
    try {
        const messages = await PostMsg.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


module.exports = { message, getMessage };