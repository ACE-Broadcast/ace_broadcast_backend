const Likes = require('../model/likeSchema');
const PostMsg = require('../model/messageSchema');

const like = async (req, res) => {
    const { email, postId } = req.body;

    if (!email || !postId) {
        return res.status(400).json({ message: "Please fill provided fields" });
    }

    try {
        const user = await Likes.findOne({ email: email });

        if (user) {
            const alreadyLiked = user.likedPosts.some(post => post.postId.toString() === postId);

            if (alreadyLiked) {
                await Likes.findOneAndUpdate(
                    { email: email },
                    { $pull: { likedPosts: { postId: postId } } }
                );

                await PostMsg.findByIdAndUpdate(
                    postId,
                    { $inc: { likeCount: -1 } }
                );

                return res.status(200).json({ 
                    success: true,
                    message: "Post unliked successfully",
                    liked: false
                });
            } else {
                await Likes.findOneAndUpdate(
                    { email: email },
                    { $push: { likedPosts: { postId: postId } } }
                );

                await PostMsg.findByIdAndUpdate(
                    postId,
                    { $inc: { likeCount: 1 } }
                );

                return res.status(200).json({
                    success: true,
                    message: "Post liked successfully",
                    liked: true
                });
            }
        } else {
            await Likes.create({
                email: email,
                likedPosts: [{ postId: postId }]
            });

            await PostMsg.findByIdAndUpdate(
                postId,
                { $inc: { likeCount: 1 } }
            );

            return res.status(200).json({
                success: true,
                message: "Post liked successfully",
                liked: true
            });
        }

    } catch (error) {
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
            'likedPosts.postId': postId
        }).select('email -_id');

        return res.status(200).json({
            likesCount: likedUsers.length,
            likedUsers: likedUsers.map(user => user.email)
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getLikedPostsByEmail = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const userLikes = await Likes.findOne({ email });

        if (!userLikes) {
            return res.status(200).json({
                success: true,
                email: email,
                likedPosts: []
            });
        }

        const likedPosts = userLikes.likedPosts.map(post => post.postId);
        const postsWithDetails = await PostMsg.find({
            '_id': { $in: likedPosts }
        }).select('username message images createdAt');

        return res.status(200).json({
            success: true,
            email: email,
            likesCount: likedPosts.length,
            likedPosts: postsWithDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { 
    like, 
    getLikes,
    getLikedPostsByEmail 
};
