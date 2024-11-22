import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, IconButton, Typography, Avatar } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Link } from 'react-router-dom';

// Define the type for tweet and user data
interface CombinedTweet {
    tweetId: number;
    userId: number;
    content: string;
    likes: number;
    mediaIds: string[];
    userName: string;
    fullName: string;
    imgUrl: string;
}

const TweetFeed = () => {
    const [tweets, setTweets] = useState<CombinedTweet[]>([]);
    const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
    const [likedTweets, setLikedTweets] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchTweets = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const response = await axios.get(`http://localhost:9002/api/tweet/userTweets/${userId}`);
                setTweets(response.data);
                const initialLikes = response.data.reduce((acc: Record<number, number>, tweet: CombinedTweet) => {
                    acc[tweet.tweetId] = tweet.likes;
                    return acc;
                }, {});
                setLikeCounts(initialLikes);

                // Initialize liked tweets
                const likedSet = new Set<number>();  // Ideally, this should be fetched from the API or user data
                setLikedTweets(likedSet);
            } catch (error) {
                console.error('Error fetching tweets:', error);
            }
        };

        fetchTweets();
    }, []);

    const handleLike = async (tweetId: number) => {
        try {
            await axios.put(`http://localhost:9002/api/tweet/like/${tweetId}`);
            setLikeCounts((prevLikes) => ({
                ...prevLikes,
                [tweetId]: (prevLikes[tweetId] || 0) + 1,
            }));
            setLikedTweets((prevLiked) => new Set(prevLiked).add(tweetId));
        } catch (error) {
            console.error('Error liking tweet:', error);
        }
    };

    const handleUnlike = async (tweetId: number) => {
        try {
            await axios.put(`http://localhost:9002/api/tweet/unlike/${tweetId}`);
            setLikeCounts((prevLikes) => ({
                ...prevLikes,
                [tweetId]: Math.max((prevLikes[tweetId] || 0) - 1, 0),
            }));
            setLikedTweets((prevLiked) => {
                const updatedLiked = new Set(prevLiked);
                updatedLiked.delete(tweetId);
                return updatedLiked;
            });
        } catch (error) {
            console.error('Error unliking tweet:', error);
        }
    };

    return (
        <div className="space-y-4">
            {tweets.map((tweet) => (
                <Card key={tweet.tweetId} className="w-full mb-4 border border-gray-300 rounded-lg shadow-lg">
                    <CardContent>
                        <div className="flex items-center mb-2">
                            <Avatar src={tweet.imgUrl} alt={tweet.userName} className="mr-3" />
                            <div>
                                <Typography variant="h6" component="div">
                                    {tweet.fullName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Link
                                        to={`/profile/${tweet.userId}`}
                                        className="text-blue-400 hover:underline"
                                    >
                                        @{tweet.userName}
                                    </Link>
                                </Typography>
                            </div>
                        </div>
                        <Typography variant="body1" paragraph>
                            {tweet.content}
                        </Typography>
                        {tweet.mediaIds.length > 0 && (
                            <div className="flex space-x-2">
                                {tweet.mediaIds.map((mediaUrl, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        image={mediaUrl}
                                        alt={`media-${index}`}
                                        className="w-full h-auto object-cover"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between mt-2">
                            <div className="flex space-x-2">
                                <IconButton
                                    onClick={() => likedTweets.has(tweet.tweetId) ? handleUnlike(tweet.tweetId) : handleLike(tweet.tweetId)}
                                >
                                    {likedTweets.has(tweet.tweetId) ? (
                                        <FavoriteIcon color="error" />
                                    ) : (
                                        <FavoriteBorderOutlinedIcon />
                                    )}
                                    <Typography variant="body2" className="ml-1">
                                        {likeCounts[tweet.tweetId] || tweet.likes}
                                    </Typography>
                                </IconButton>
                                <IconButton>
                                    <RepeatOutlinedIcon />
                                </IconButton>
                                <IconButton>
                                    <CommentOutlinedIcon />
                                </IconButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TweetFeed;
