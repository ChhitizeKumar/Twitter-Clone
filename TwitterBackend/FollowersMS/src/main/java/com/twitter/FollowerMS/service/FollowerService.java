package com.twitter.FollowerMS.service;
import com.twitter.FollowerMS.exception.FollowerException;
import java.util.List;

public interface FollowerService {
    public void followUser(Integer followerId, Integer followingId) throws FollowerException;
    public void unFollowUser(Integer followerId, Integer followingId);

    public List<Integer> getAllFollowers(Integer userId) throws FollowerException;

    public List<Integer> getAllFollowings(Integer userId) throws FollowerException;

    public Boolean checkFollowerExists(Integer followerId, Integer followingId);
}
