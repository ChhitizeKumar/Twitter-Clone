import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import NavBar from './components/NavBar/NavBar'; // Ensure the path is correct
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './components/LoginForm/ForgotPasswordPage';
import UserProfile from './components/Profile/UserProfile';
import TweetForm1 from './components/MiddleContent/TweetForm1';
import GetUserProfile from './components/Profile/GetUserProfile';
import Explore from './components/Explore/Explore';
import ProtectedRoute from './components/Authentication/ProtectedRoute';

const App: React.FC = () => {
  const location = useLocation();

  // List of routes where the NavBar should be visible
  const routesWithNavBar = ['/login', '/signup', '/'];

  // Determine if NavBar should be hidden based on the current route
  const shouldHideNavBar = !routesWithNavBar.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavBar && <NavBar />}
      <Routes>
        
        <Route element={<ProtectedRoute redirectPath="/home" shouldRedirect={false} />}>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute redirectPath="/login" shouldRedirect={true} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<GetUserProfile />} />
          <Route path="/addTweet" element={<TweetForm1 />} />
          <Route path="/explore" element={<Explore />} />
        </Route>

        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App
