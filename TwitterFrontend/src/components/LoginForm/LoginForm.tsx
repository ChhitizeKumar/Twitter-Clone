import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Snackbar, Alert, InputAdornment } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Twitter } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9001/api/user/login', { email, password });
            if (response.data.msg === 'Login Successful') {
                setSuccess('Login Successful');
                setTimeout(() => navigate('/home'), 2000);
                console.log(response.data);


                localStorage.setItem('userId', response.data.userId); // Save userId to local storage

                
            }
        } catch (error) {
            setError('Invalid Credentials');
            setEmail('');
            setPassword('');
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleClose = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-50 to-sky-300">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex items-center mb-6">
                    <Twitter fontSize="large" color="primary" className='mx-8'/>
                    <Typography variant="h5" component="h2" className="ml-4">
                        Login to Twitter
                    </Typography>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <Button onClick={handleClickShowPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </Button>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                    <div className="text-center mt-4">
                        <Link to="/forgot-password" className="text-blue-500">
                            Forgot password?
                        </Link>
                    </div>
                </form>
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={!!success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default LoginForm;
