import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardMedia, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Explore: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:9001/api/user/others/${userId}`);
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleFollow = async (userId: number) => {
        try {
            const followerId = localStorage.getItem('userId');
            await axios.post('http://localhost:9005/api/follow', null, {
                params: {
                    followerId: followerId,
                    followingId: userId,
                },
            });
            setFollowedUsers(prev => new Set(prev).add(userId));
        } catch (err) {
            setError('Failed to follow user');
        }
    };

    const handleProfileNavigation = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            {error && <Alert severity="error">{error}</Alert>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map(user => (
                    <Card
                        key={user.id}
                        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
                        sx={{ maxWidth: 345 }}
                    >
                        <CardMedia
                            component="img"
                            image={user.imageUrl}
                            alt={user.userName}
                            className="w-full h-48 object-cover"
                            sx={{ borderRadius: '50%', border: '4px solid #1DA1F2', marginTop: 2 }}
                        />
                        <CardContent className="text-center">
                            <Typography
                                variant="h6"
                                component="div"
                                className="cursor-pointer hover:underline"
                                onClick={() => handleProfileNavigation(user.id)}
                            >
                                {user.userName}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                className="text-gray-400"
                            >
                                {user.fullName}
                            </Typography>
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="contained"
                                    color={followedUsers.has(user.id) ? "success" : "primary"}
                                    disabled={followedUsers.has(user.id)}
                                    onClick={() => handleFollow(user.id)}
                                    className="capitalize"
                                    sx={{
                                        backgroundColor: followedUsers.has(user.id) ? '#4CAF50' : '#1DA1F2',
                                        '&:hover': {
                                            backgroundColor: followedUsers.has(user.id) ? '#388E3C' : '#0d95e8',
                                        },
                                    }}
                                >
                                    {followedUsers.has(user.id) ? "Followed" : "Follow"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Explore;
