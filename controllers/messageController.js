const Message = require('../models/Message');
const Like = require('../models/Like');

const messageController = {
    getMessages: async (req, res) => {
        try {
            const { email } = req.query;
            const messages = await Message.find().sort({ timestamp: -1 });
            
            // Get likes information for all messages
            const messagesWithLikes = await Promise.all(messages.map(async (message) => {
                const likes = await Like.find({ postId: message._id.toString() })
                    .select('email -_id');
                const likesList = likes.map(like => like.email);
                
                return {
                    _id: message._id,
                    username: message.username,
                    message: message.message,
                    timestamp: message.timestamp,
                    likes: likesList,
                    likesCount: likesList.length,
                    isLiked: email ? likesList.includes(email) : false,
                    commentsCount: message.commentsCount || 0
                };
            }));

            res.json({ 
                success: true, 
                data: messagesWithLikes 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    },

    // ... other existing methods
};

module.exports = messageController; 