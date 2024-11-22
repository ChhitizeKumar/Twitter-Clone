import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon,
    Explore as ExploreIcon,
    Notifications as NotificationsIcon,
    Message as MessageIcon,
    ListAlt as ListAltIcon,
    Group as GroupIcon,
    Verified as VerifiedIcon,
    AccountCircle as AccountCircleIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Menu, MenuItem, Card, IconButton } from '@mui/material';
import axios from 'axios';
import TwitterIcon from '@mui/icons-material/Twitter';
import PendingIcon from '@mui/icons-material/Pending';

const navigationMenu = [
    { title: 'Home', icon: <HomeIcon />, path: '/home' },
    { title: 'Explore', icon: <ExploreIcon />, path: '/explore' },
    { title: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    { title: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { title: 'Lists', icon: <ListAltIcon />, path: '/lists' },
    { title: 'Communities', icon: <GroupIcon />, path: '/communities' },
    { title: 'Verified', icon: <VerifiedIcon />, path: '/verified' },
    { title: 'Profile', icon: <AccountCircleIcon />, path: `/profile` },
    { title: 'More', icon: <PendingIcon />, path: '/more' },
];

const LeftSidebar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userData, setUserData] = useState<{ fullName: string, userName: string } | null>(null);
    const userId = localStorage.getItem('userId');

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:9001/api/user/${userId}`)
                .then(response => {
                    setUserData({
                        fullName: response.data.fullName,
                        userName: response.data.userName
                    });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId]);

    return (
        <div className="w-1/4 p-4 space-y-6">

            {/* Header with Twitter Icon and Heading */}
            <div className="flex items-center mb-4">
                <TwitterIcon sx={{ fontSize: 40, color: '#1DA1F2' }} />
                <h1 className="text-2xl font-bold ml-3 text-blue-600">Twitter</h1>
            </div>

            <div className="space-y-4">
                {navigationMenu.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg text-lg text-gray-800"
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>

            {/* Profile Card */}
            <Card className="p-4 mt-8 relative shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800">{userData?.fullName || 'User Name'}</h3>
                        <p className="text-sm text-gray-500">@{userData?.userName || 'username'}</p>
                    </div>
                    <IconButton onClick={handleMenuClick}>
                        <MoreVertIcon />
                    </IconButton>
                </div>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Card>
        </div>
    );
};

export default LeftSidebar;
