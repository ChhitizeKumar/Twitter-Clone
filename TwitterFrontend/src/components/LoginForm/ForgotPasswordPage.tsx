import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to handle the forgot password request here
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2">
                        <EmailIcon className="text-gray-400 mr-2" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-2 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Send Reset Link
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-4">
                    Enter your email to receive a password reset link.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
