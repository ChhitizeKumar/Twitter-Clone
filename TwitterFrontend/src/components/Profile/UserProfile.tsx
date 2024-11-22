import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Tab, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';
import TweetCard from "../TweetCard/TweetCard";

interface Tweet {
  id: number;
  content: string;
  media: string[];
  likes: number;
}

interface UserData {
  name: string;
  username: string;
  profileImage: string;
  coverImage: string;
  isEditing: boolean;
}

interface UserDetail {
  userName: string;
  fullName: string;
  imageUrl: string | null; 
  id: number;
}

// Fetch user data
const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await axios.get(`http://localhost:9001/api/user/${userId}`);
    return {
      name: response.data.fullName,
      username: response.data.userName,
      profileImage: response.data.imgUrl || "https://th.bing.com/th/id/OIP.x3D8JgIPCemZ5VSA8QQU0AHaHa?rs=1&pid=ImgDetMain",
      coverImage:  "https://www.ecofleetuk.com/wp/wp-content/uploads/2016/12/PIXABAY-FREE-road-685655_1920.jpg",
      isEditing: response.data.isEditing
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      name: "Unknown",
      username: "unknown",
      profileImage: "https://th.bing.com/th/id/OIP.x3D8JgIPCemZ5VSA8QQU0AHaHa?rs=1&pid=ImgDetMain",
      coverImage: "https://www.ecofleetuk.com/wp/wp-content/uploads/2016/12/PIXABAY-FREE-road-685655_1920.jpg",
      isEditing: false
    };
  }
};

// Fetch followers and followings count
const getFollowersCount = async (userId: string): Promise<number> => {
  try {
    const response = await axios.get(`http://localhost:9005/api/followers/${userId}`);
    return response.data.length;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return 0;
  }
};

const getFollowingsCount = async (userId: string): Promise<number> => {
  try {
    const response = await axios.get(`http://localhost:9005/api/followings/${userId}`);
    return response.data.length;
  } catch (error) {
    console.error('Error fetching followings:', error);
    return 0;
  }
};

// Fetch tweets
const fetchTweets = async (userId: string): Promise<Tweet[]> => {
  try {
    const response = await axios.get(`http://localhost:9002/api/tweet/${userId}`);
    return response.data.map((tweet: any) => ({
      id: tweet.tweetId,
      content: tweet.content,
      media: tweet.mediaIds.map((mediaId: string) => `${mediaId}`),
      likes: tweet.likes,
    }));
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
};

// Fetch followers and followings
const fetchFollowers = async (userId: string): Promise<UserDetail[]> => {
  try {
    const response = await axios.get(`http://localhost:9001/api/user/followers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

const fetchFollowings = async (userId: string): Promise<UserDetail[]> => {
  try {
    const response = await axios.get(`http://localhost:9001/api/user/followings/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followings:', error);
    return [];
  }
};

const UserProfile = () => {
  const [tabValue, setTabValue] = useState<string>("1");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<{ followers: number, following: number }>({ followers: 0, following: 0 });
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [followers, setFollowers] = useState<UserDetail[]>([]);
  const [followings, setFollowings] = useState<UserDetail[]>([]);
  const [openFollowersDialog, setOpenFollowersDialog] = useState<boolean>(false);
  const [openFollowingsDialog, setOpenFollowingsDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId') || "1"; // Replace with actual logic to get the userId

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(userId);
      setUserData(data);
    };
    const getStats = async () => {
      const followersCount = await getFollowersCount(userId);
      const followingsCount = await getFollowingsCount(userId);
      setStats({ followers: followersCount, following: followingsCount });
    };
    const getTweets = async () => {
      const data = await fetchTweets(userId);
      setTweets(data);
    };
    const getFollowers = async () => {
      const data = await fetchFollowers(userId);
      setFollowers(data);
    };
    const getFollowings = async () => {
      const data = await fetchFollowings(userId);
      setFollowings(data);
    };

    getUserData();
    getStats();
    getTweets();
    getFollowers();
    getFollowings();
  }, [userId]);

  const handleBack = () => navigate(-1);

  const handleOpenFollowersDialog = () => setOpenFollowersDialog(true);
  const handleCloseFollowersDialog = () => setOpenFollowersDialog(false);

  const handleOpenFollowingsDialog = () => setOpenFollowingsDialog(true);
  const handleCloseFollowingsDialog = () => setOpenFollowingsDialog(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === "4") {
      console.log("Liked tweets");
    }
  }

  const handleAddNewTweet = () => {
    navigate('/addTweet'); // Adjust the path according to your routing setup
  }

  const handleGoToHomepage = () => {
    navigate('/home'); // Adjust the path to your homepage route
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Cover Image */}
      <section className="relative">
        <img className="w-full h-64 object-cover" src={userData.coverImage} alt="Cover" />

        {/* Homepage Button in the right corner */}
      </section>

   <section className="flex items-center justify-between px-6 mt-[-5rem]">
        {/* Profile Image in the left corner */}
        <Avatar
          alt="Profile"
          src={userData.profileImage}
          sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
        />

        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: "20px" }}
          onClick={handleGoToHomepage}
        >
          HomePage
        </Button>
    </section>


      {/* Profile Details */}
      <section className="flex flex-col items-start w-full pl-6 mt-4">
        <div className="mb-4">
          <Typography variant="h5">{userData.name}</Typography>
          <Typography variant="body1" color="textSecondary">@{userData.username}</Typography>
        </div>

        <div className="flex space-x-6">
          <Button variant="outlined" color="primary" onClick={handleOpenFollowersDialog}>
            {stats.followers} Followers
          </Button>
          <Button variant="outlined" color="primary" onClick={handleOpenFollowingsDialog}>
            {stats.following} Following
          </Button>
        </div>
        
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2, borderRadius: 2 }} 
          onClick={handleAddNewTweet}
        >
          Add New Tweet
        </Button>
      </section>

      {/* Tweets Section */}
      <section className="flex-grow w-full mt-6">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                <Tab label="Tweets" value="1" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="flex flex-row flex-wrap">
                {tweets.length > 0 ? (
                  tweets.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                  ))
                ) : (
                  <Typography variant="body1">No tweets to display.</Typography>
                )}
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </section>

      {/* Followers Dialog */}
      <Dialog open={openFollowersDialog} onClose={handleCloseFollowersDialog}>
        <DialogTitle>Followers</DialogTitle>
        <DialogContent>
          {followers.length > 0 ? (
            followers.map(follower => (
              <FollowerCard
                id={follower.id}
                key={follower.id}
                userName={follower.userName}
                fullName={follower.fullName}
                imageUrl={follower.imageUrl || "https://via.placeholder.com/50"} // Fallback placeholder
              />
            ))
          ) : (
            <Typography>No followers found.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Followings Dialog */}
      <Dialog open={openFollowingsDialog} onClose={handleCloseFollowingsDialog}>
        <DialogTitle>Following</DialogTitle>
        <DialogContent>
          {followings.length > 0 ? (
            followings.map(following => (
              <FollowingCard
                key={following.id}
                id={following.id}
                userName={following.userName}
                fullName={following.fullName}
                imageUrl={following.imageUrl || "https://via.placeholder.com/50"} // Fallback placeholder
              />
            ))
          ) : (
            <Typography>No followings found.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserProfile;
