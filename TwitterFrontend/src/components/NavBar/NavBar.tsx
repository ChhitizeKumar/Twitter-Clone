import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Navbar: React.FC = () => {
    const location = useLocation();
    const theme = useTheme();

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-4">
                {/* Twitter Icon */}
                <Link to="/">
                    <IconButton>
                        <TwitterIcon fontSize="large" style={{ color: 'white' }} />
                    </IconButton>
                </Link>
            </div>
            <div className="flex space-x-4">
                <Link
                    to="/signup"
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${location.pathname === '/signup'
                        ? 'bg-white text-blue-700 font-semibold shadow-md'
                        : 'text-white hover:bg-blue-400'
                        }`}
                >
                    Sign Up
                </Link>
                <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${location.pathname === '/login'
                        ? 'bg-white text-blue-700 font-semibold shadow-md'
                        : 'text-white hover:bg-blue-400'
                        }`}
                >
                    Login
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
