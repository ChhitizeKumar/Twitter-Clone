import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Card, CardContent, Typography, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Search as SearchIcon } from '@mui/icons-material';

const RightSidebar = () => {
    const [userSearch, setUserSearch] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const navigate = useNavigate();

    const searchUsers = useCallback(async (e) => {
        const query = e.target.value;
        setUserSearch(query);

        if (query) {
            try {
                const res = await axios.get(`http://localhost:9003/api/search/${query}`);
                setUserSuggestions(res.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        } else {
            setUserSuggestions([]);
        }
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="w-1/4 p-4 space-y-4">
            <div className="relative">
                <TextField
                    type="text"
                    value={userSearch}
                    onChange={searchUsers}
                    placeholder="Search Users"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
                {userSuggestions.length > 0 && (
                    <div className="absolute left-0 w-full mt-2 bg-white shadow-lg rounded-lg z-10">
                        {userSuggestions.map((user) => (
                            <Card
                                key={user.userId}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleUserClick(user.userId)}
                            >
                                <CardContent className="flex items-center space-x-4 p-4">
                                    <PersonIcon className="text-blue-500" style={{ fontSize: 40 }} />
                                    <div>
                                        <Typography variant="h6" className="font-semibold">{user.username}</Typography>
                                        <Typography variant="body2" color="textSecondary">{user.name}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Display trending topics */}
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">What’s happening</h3>
                    <p>Sports · Trending · BCCI · 12.1K posts</p>
                    <p>Sports · Trending · Noida · 10.3K posts</p>
                    {/* More trending items */}
                </div>
            </div>

            {/* Who to follow */}
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                <h3 className="font-semibold">Who to follow</h3>
                <p>@SportsCenter</p>
                <p>@ImRo45</p>
            </div>
        </div>
    );
};

export default RightSidebar;
