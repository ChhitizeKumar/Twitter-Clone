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
    const { control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<Omit<TweetDTO, 'tweetId'>>({
        defaultValues: {
            content: '',
            likes: 0,
            mediaIds: [],
            userId: undefined,
        },
    });

    const [mediaFiles, setMediaFiles] = React.useState<File[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
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
            const userId = localStorage.getItem('userId');

            const formData = new FormData();
            const tweetData = {
                ...data,
                userId: userId || undefined,
            };

            formData.append('tweetDTO', JSON.stringify(tweetData));

            if (mediaFiles.length > 0) {
                mediaFiles.forEach((file) => formData.append('mediaFiles', file));
            }

            const response = await axios.post('http://localhost:9002/api/tweet/', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
            });

            console.log('Tweet added successfully:', response.data);

            setSnackbarMessage('Tweet Posted Successfully');
            setSnackbarOpen(true);

            // Clear form data
            reset();
            setMediaFiles([]);
        } catch (error) {
            console.error('Error adding tweet:', error);
            setSnackbarMessage('Failed to post tweet');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="relative flex flex-col items-center w-full p-4">
            <div className="absolute inset-0 bg-cover bg-center bg-blue-100" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/6/60/Twitter_Logo_as_of_2020.svg")' }}></div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6 space-y-6 z-10"
            >
                {/* Twitter Icon and Heading */}
                <div className="flex items-center space-x-4 mb-6">
                    {/* Twitter Icon */}
                    <IconButton>
                        <TwitterIcon className="text-blue-500" style={{ fontSize: 32 }} />
                    </IconButton>

                    {/* Centered Heading */}
                    <Typography variant="h6" component="h2" className="font-bold text-blue-700">
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
                                rows={4}
                                fullWidth
                                error={!!errors.content}
                                helperText={errors.content ? "Content is required" : ""}
                                className="bg-white"
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
                        <EmojiEmotionsIcon className="text-yellow-500" style={{ fontSize: 24 }} />
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
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Tweet
                    </Button>
                </div>
            </form>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarMessage === 'Tweet Posted Successfully' ? 'success' : 'error'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TweetForm;
