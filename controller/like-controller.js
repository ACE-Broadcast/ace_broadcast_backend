const Likes = require('../model/likeSchema');
const PostMsg = require('../model/messageSchema');

const like = async (req, res) => {
    const { email, postId } = req.body;

    if(!email || !postId) {
        return res.status(400).json({ message: "Please fill provided fields" });
    }

    try {
        const user = await Likes.findOne({ email: email });
        
        if(user) {
            const alreadyLiked = user.likedPosts.includes(postId);
            
            if(alreadyLiked) {
              
                await Likes.findOneAndUpdate(
                    { email: email },
                    { $pull: { likedPosts: postId }}
                );

                await PostMsg.findByIdAndUpdate(
                    postId,
                    { $inc: { likeCount: -1 }}
                );

                return res.status(200).json({ message: "Post unliked successfully" });
            } else {
                await Likes.findOneAndUpdate(
                    { email: email },
                    { $push: { likedPosts: postId }}
                );
            }
        } else {
            await Likes.create({
                email: email,
                likedPosts: [postId]
            });
        }

        await PostMsg.findByIdAndUpdate(
            postId,
            { $inc: { likeCount: 1 }}
        );

        return res.status(200).json({ message: "Post liked successfully" });

    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
};

const getLikes = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
    }

    try {
        const post = await PostMsg.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likedUsers = await Likes.find({ 
            likedPosts: postId 
        }).select('email -_id');

        return res.status(200).json({ 
            likesCount : likedUsers.length,
            likedUsers: likedUsers.map(user => user.email)
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { like, getLikes };
