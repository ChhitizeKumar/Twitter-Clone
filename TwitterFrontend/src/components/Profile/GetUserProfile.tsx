import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  Tab
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import FollowerCard from "./FollowerCard";
import FollowingCard from "./FollowingCard";
import TweetCard from "../TweetCard/TweetCard";

interface Tweet {
  id: number;
  content: string;
  media: string[];
  likes: number;
}

interface UserData {
  fullName: string;
  userName: string;
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
      fullName: response.data.fullName,
      userName: response.data.userName,
      profileImage: response.data.imgUrl,
      coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5arvyM6_pxRwH24KheyfiL4e8w-5iL1cltw&s",
      isEditing: false
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      fullName: "Unknown User",
      userName: "unknown_user",
      profileImage: "",
      coverImage: "https://example.com/default-cover.jpg",
      isEditing: false
    };
  }
};

// Fetch followers count
const getFollowersCount = async (userId: string): Promise<number> => {
  try {
    const response = await axios.get(`http://localhost:9005/api/followers/${userId}`);
    return response.data.length;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return 0;
  }
};

// Fetch followings count
const getFollowingsCount = async (userId: string): Promise<number> => {
  try {
    const response = await axios.get(`http://localhost:9005/api/followings/${userId}`);
    return response.data.length;
  } catch (error) {
    console.error('Error fetching followings:', error);
    return 0;
  }
};

// Fetch followers
const fetchFollowers = async (userId: string): Promise<UserDetail[]> => {
  try {
    const response = await axios.get(`http://localhost:9001/api/user/followers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

// Fetch followings
const fetchFollowings = async (userId: string): Promise<UserDetail[]> => {
  try {
    const response = await axios.get(`http://localhost:9001/api/user/followings/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followings:', error);
    return [];
  }
};

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

// Check if already following
const checkIfFollowing = async (followerId: number, followingId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`http://localhost:9005/api/follow/already-follows`, {
      params: { followerId, followingId }
    });
    return response.data; // Expecting boolean response
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

// Follow a user
const followUser = async (followerId: number, followingId: number): Promise<void> => {
  try {
    await axios.post(`http://localhost:9005/api/follow`, null, {
      params: { followerId, followingId }
    });
  } catch (error) {
    console.error('Error following user:', error);
  }
};

// Unfollow a user
const unfollowUser = async (followerId: number, followingId: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:9005/api/unfollow`, {
      params: { followerId, followingId }
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};

const GetUserProfile = () => {
  const { userId } = useParams<{ userId: string }>(); // Get followingId from the URL
  const [tabValue, setTabValue] = useState<string>("1");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<{ followers: number, following: number }>({ followers: 0, following: 0 });
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [followers, setFollowers] = useState<UserDetail[]>([]);
  const [followings, setFollowings] = useState<UserDetail[]>([]);
  const [openFollowersDialog, setOpenFollowersDialog] = useState<boolean>(false);
  const [openFollowingsDialog, setOpenFollowingsDialog] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Track follow status
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      return; // Handle the case where userId is not present
    }

    const fetchUserDataAndStatus = async () => {
      try {
        const data = await fetchUserData(userId);
        setUserData(data);

        const followingId = parseInt(userId); // Profile user ID
        const followerId = parseInt(localStorage.getItem("userId") || "0"); // Current user ID from local storage

        const following = await checkIfFollowing(followerId, followingId);
        setIsFollowing(following);

        const followersCount = await getFollowersCount(userId);
        const followingsCount = await getFollowingsCount(userId);
        setStats({ followers: followersCount, following: followingsCount });

        const tweetData = await fetchTweets(userId);
        setTweets(tweetData);

        const followerData = await fetchFollowers(userId);
        setFollowers(followerData);

        const followingData = await fetchFollowings(userId);
        setFollowings(followingData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserDataAndStatus();
  }, [userId, isFollowing]);

  const handleFollow = async () => {
    const followingId = parseInt(userId); // Profile user ID
    const followerId = parseInt(localStorage.getItem("userId") || "0"); // Current user ID from local storage

    if (isFollowing) {
      await unfollowUser(followerId, followingId);
      setIsFollowing(false);
    } else {
      await followUser(followerId, followingId);
      setIsFollowing(true);
    }
  };

  const handleOpenFollowersDialog = () => setOpenFollowersDialog(true);
  const handleCloseFollowersDialog = () => setOpenFollowersDialog(false);

  const handleOpenFollowingsDialog = () => setOpenFollowingsDialog(true);
  const handleCloseFollowingsDialog = () => setOpenFollowingsDialog(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === "4") {
      console.log("Liked tweets");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <section className="flex flex-col w-full">
        <img className="w-full h-64 object-cover" src={userData.coverImage} alt="Cover" />
      </section>

      <section className="flex items-center justify-between px-6 mt-[-5rem]">
        <Avatar
          src={userData.profileImage}
          sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
        >
          <PersonIcon sx={{ fontSize: "10rem" }} />
        </Avatar>
        <Button
          variant="contained"
          onClick={handleFollow}
          sx={{
            borderRadius: "20px",
            backgroundColor: isFollowing ? "#90CAF9" : "#D32F2F", // Light blue if following, red otherwise
            '&:hover': {
              backgroundColor: isFollowing ? "#64B5F6" : "#C62828" // Slightly different shades on hover
            }
          }}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </section>

      <section className="flex flex-col items-start w-full pl-6 mt-4">
        <Typography variant="h4" className="font-bold">{userData.fullName}</Typography>
        <Typography variant="h6" color="textSecondary">@{userData.userName}</Typography>

        <div className="mt-2 flex space-x-5">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenFollowersDialog}
          >
            {stats.followers} Followers
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenFollowingsDialog}
          >
            {stats.following} Following
          </Button>
        </div>
      </section>

      <section className="flex-grow w-full mt-6">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="user profile tabs">
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

      <Dialog open={openFollowersDialog} onClose={handleCloseFollowersDialog}>
        <DialogTitle>Followers</DialogTitle>
        <DialogContent>
          <List>
            {followers.length > 0 ? (
              followers.map(follower => (
                <FollowerCard
                  key={follower.id}
                  id={follower.id}
                  userName={follower.userName}
                  fullName={follower.fullName}
                  imageUrl={follower.imageUrl || "https://via.placeholder.com/50"}
                />
              ))
            ) : (
              <Typography>No followers found.</Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog open={openFollowingsDialog} onClose={handleCloseFollowingsDialog}>
        <DialogTitle>Followings</DialogTitle>
        <DialogContent>
          {followings.map((following) => (
            <FollowingCard
              key={following.id}
              id={following.id}
              userName={following.userName}
              fullName={following.fullName}
              imageUrl={following.imageUrl || "https://via.placeholder.com/50"}
            />
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetUserProfile;
