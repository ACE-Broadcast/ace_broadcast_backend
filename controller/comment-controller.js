const PostMsg = require('../model/messageSchema');
const Comment = require('../model/commentSchema');

const postComment = async (req, res) => {
    const { postId } = req.params;
    const { username, content } = req.body;

    if (!postId || !username || !content) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        const post = await PostMsg.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const newComment = await Comment.create({
            postId: postId,
            username: username,
            comment: content,
            createdAt: new Date()
        });
        await PostMsg.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id }}
        );
        return res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getComments = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
    }

    try {
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .select('username comment timestamp');

        return res.status(200).json({
            count: comments.length,
            comments
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { postComment, getComments };
