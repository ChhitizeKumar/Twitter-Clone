import React, { ChangeEvent, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, IconButton, Typography, Popover, Snackbar, Alert } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useNavigate } from 'react-router-dom';
import { TweetDTO } from './TweetDTO';
import EmojiPicker from 'emoji-picker-react';

const TweetForm: React.FC = () => {
    // Initialize react-hook-form
    const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<Omit<TweetDTO, 'tweetId'>>({
        defaultValues: {
            content: '',
            likes: 0,
            mediaIds: [],
            userId: undefined,
        },
    });

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();

    const handleMediaFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setMediaFiles(Array.from(event.target.files));
        }
    };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        const currentContent = getValues("content");
        setValue("content", currentContent + emojiData.emoji);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'emoji-popover' : undefined;

    const onSubmit = async (data: Omit<TweetDTO, 'tweetId'>) => {
        try {
            // Get the logged-in user's ID (for example from localStorage)
            const userId = localStorage.getItem('userId'); // Replace with your actual logic

            // Prepare form data
            const formData = new FormData();

            // Include content and userId
            const tweetData = {
                ...data,
                userId: userId || undefined, // Include the userId if available
            };

            formData.append('tweetDTO', JSON.stringify(tweetData));

            // Append media files if they exist
            if (mediaFiles.length > 0) {
                mediaFiles.forEach((file) => formData.append('mediaFiles', file));
            }

            // Send POST request
            const response = await axios.post('http://localhost:9002/api/tweet/', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
            });

            console.log('Tweet added successfully:', response.data);
            setSnackbarMessage('Tweet added successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Redirect to profile page
            navigate(`/profile`); // Adjust the path based on your routing setup
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Log error response data for debugging
                console.error('Error response data:', error.response.data);
                setSnackbarMessage('Failed to add tweet. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } else {
                // Handle unknown errors
                console.error('Error adding tweet:', error);
                setSnackbarMessage('Failed to add tweet. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="relative min-h-screen bg-blue-50 flex items-center justify-center w-full">
            <div className="absolute inset-0 bg-cover bg-center bg-blue-100" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/6/60/Twitter_Logo_as_of_2020.svg")' }}></div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto p-12 space-y-8 z-10"
                style={{ width: '50vw', minWidth: '600px' }}
            >
                {/* Twitter Icon and Heading */}
                <div className="flex items-center space-x-4 mb-8">
                    {/* Twitter Icon */}
                    <IconButton>
                        <TwitterIcon className="text-blue-500" style={{ fontSize: 40 }} />
                    </IconButton>

                    {/* Centered Heading */}
                    <Typography variant="h5" component="h2" className="font-bold text-blue-700">
                        What's happening?
                    </Typography>
                </div>

                {/* Content Field */}
                <div>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="What's on your mind?"
                                variant="outlined"
                                multiline
                                rows={6}
                                fullWidth
                                error={!!errors.content}
                                helperText={errors.content ? "Content is required" : ""}
                                className="bg-white rounded-lg"
                            />
                        )}
                        rules={{ required: 'Content is required' }}
                    />
                </div>

                {/* Media Files Upload */}
                <div>
                    <input
                        type="file"
                        multiple
                        onChange={handleMediaFilesChange}
                        className="w-full text-sm text-gray-500 file:bg-blue-100 file:text-blue-700 file:font-semibold file:py-2 file:px-4 file:rounded-md file:border-0 hover:file:bg-blue-200"
                    />
                </div>

                {/* Emoji Picker Button */}
                <div className="flex items-center space-x-2">
                    <IconButton onClick={handleClick}>
                        <EmojiEmotionsIcon className="text-yellow-500" style={{ fontSize: 30 }} />
                    </IconButton>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Popover>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md"
                    >
                        Tweet
                    </Button>
                </div>
            </form>

            {/* Snackbar for success or error message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TweetForm;
