// FollowerCard.tsx
import React from 'react';
import { Avatar, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FollowerCardProps {
    id: number;
    userName: string;
    fullName: string;
    imageUrl: string | null;
}


const FollowerCard: React.FC<FollowerCardProps> = ({id, userName, fullName, imageUrl }) => {
    const navigate = useNavigate();

    const handelClick = () => {
        navigate(`/profile/${id}`)
    }


    return (
        <Card sx={{ display: 'flex', alignItems: 'center', mb: 1, bgcolor: '#f9f9f9', cursor: 'pointer' }} onClick = {handelClick}>
            <Avatar alt={userName} src={imageUrl || ''} sx={{ width: 56, height: 56 }} />
            <CardContent>
                <Typography variant="h6" component="div" className="text-gray-800">
                    {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    @{userName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FollowerCard;
