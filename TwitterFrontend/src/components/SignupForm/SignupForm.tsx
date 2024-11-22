import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, Email, Lock, LockOpen, Twitter, Visibility, VisibilityOff } from '@mui/icons-material';

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    // Validation functions
    const validateUsername = (value: string) => {
        return value.length >= 3 ? '' : 'Username must be at least 3 characters long';
    };

    const validatename = (value: string) => {
        const nameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
        return nameRegex.test(value) ? '' : 'Enter a valid name (e.g., John Doe)';
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|in)$/;
        return emailRegex.test(value) ? '' : 'Enter a valid email (e.g., example@domain.com)';
    };

    const validatePassword = (value: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return passwordRegex.test(value) ? '' : 'Password must be 8-16 characters long, include uppercase, lowercase, digits, and special characters';
    };

    const validateConfirmPassword = (value: string) => {
        return value === password ? '' : 'Passwords do not match';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            username: validateUsername(username),
            name: validatename(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:9001/api/user/register', { username, name, email, password });
            if (response.data === 'Registration Success') {
                console.log(response);
                
                setSuccess('User Registration is successful');
                
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } else {
                setError('Registration Failed, Please Register Again');
            }
        } catch (error) {
            setError('Registration Failed, Please Register Again');
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-100 to-sky-300 pt-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center mb-6">
                    <Twitter fontSize="large" color="primary" className='mx-8' />
                    <Typography variant="h5" component="h2" className="ml-4">
                        Welcome to Twitter
                    </Typography>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        helperText={errors.username}
                        error={!!errors.username}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        helperText={errors.name}
                        error={!!errors.name}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        helperText={errors.email}
                        error={!!errors.email}
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
                        helperText={errors.password}
                        error={!!errors.password}
                        type={showPassword ? 'text' : 'password'}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        helperText={errors.confirmPassword}
                        error={!!errors.confirmPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOpen />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
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
                        Sign Up
                    </Button>
                    <div className="text-center mt-4">
                        <span>Already have an account? </span>
                        <Link to="/login" className="text-blue-500">
                            Login
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

export default SignupForm;
