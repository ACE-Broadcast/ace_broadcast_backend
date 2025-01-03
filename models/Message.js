class Message {
    constructor() {
        this.id = '';
        this.username = '';
        this.message = '';
        this.timestamp = null;
        this.likesCount = 0;
        this.isLiked = false;
        this.likes = [];
        this.commentsCount = 0;
    }

    static fromJson(json) {
        const message = new Message();
        message.id = json._id;
        message.username = json.username;
        message.message = json.message;
        message.timestamp = new Date(json.timestamp);
        message.likesCount = json.likesCount || 0;
        message.isLiked = json.isLiked || false;
        message.likes = json.likes || [];
        message.commentsCount = json.commentsCount || 0;
        return message;
    }
}

module.exports = Message; 