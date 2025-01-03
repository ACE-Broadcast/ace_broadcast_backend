async _fetchMessages() {
    try {
        const email = await this._getCurrentUserEmail(); // Implement this to get current user's email
        const response = await fetch(`/api/messages?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch messages');
        }

        return data.data.map(Message.fromJson);
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

async _postLike(postId) {
    try {
        const email = await this._getCurrentUserEmail();
        const response = await fetch('/api/like/postLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, email }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to toggle like');
        }

        // Update local message state with new likes info
        this._updateMessageLikes(postId, {
            likesCount: data.likesCount,
            isLiked: data.liked,
            likes: data.likes
        });

        return data;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
}

_updateMessageLikes(postId, likeInfo) {
    // Implement this method to update your local message state
    // with the new likes information
    const message = this.messages.find(m => m.id === postId);
    if (message) {
        message.likesCount = likeInfo.likesCount;
        message.isLiked = likeInfo.isLiked;
        message.likes = likeInfo.likes;
    }
}

// Helper method to get current user's email
async _getCurrentUserEmail() {
    // Implement this based on your authentication system
    // For example:
    const user = await auth.currentUser;
    return user ? user.email : null;
} 