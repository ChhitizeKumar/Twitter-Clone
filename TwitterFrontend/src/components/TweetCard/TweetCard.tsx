import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';

interface TweetCardProps {
    tweet: {
        id: string;
        content: string;
        media: string[];
        likes: number;
        likedByUser: boolean;
    };
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(tweet.likes);

    const handleLike = async () => {
        try {
            if (liked) {
                // Unlike the tweet
                await axios.put(`http://localhost:9002/api/tweet/unlike/${tweet.id}`);
                setLikes(likes - 1);
            } else {
                // Like the tweet
                await axios.put(`http://localhost:9002/api/tweet/like/${tweet.id}`);
                setLikes(likes + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking/unliking the tweet', error);
        }
    };

    return (
        <Box className="border border-gray-300 p-4 rounded-lg w-100 mx-16 gap-2 justify-between mt-2">
            {/* Tweet Content */}
            <Typography variant="body1" className="mb-2">{tweet.content}</Typography>

            {/* Media (if any) */}
            {tweet.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tweet.media.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`media-${index}`}
                            className="w-full max-w-xs object-cover rounded"
                        />
                    ))}
                </div>
            )}

            {/* Actions: Like, Retweet, Comment */}
            <Box className="flex items-center space-x-4 mt-2">
                <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color="textSecondary">{likes} Likes</Typography>

                <IconButton>
                    <RepeatIcon />
                </IconButton>
                <Typography variant="body2" color="textSecondary">Retweet</Typography>

                <IconButton>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body2" color="textSecondary">Comment</Typography>
            </Box>
        </Box>
    );
};

export default TweetCard;
